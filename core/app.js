var child       = require('child_process')  // spawning stuff
  , freeport    = require('freeport')       // get free ports
  , fs          = require('fs')             // filesystem ops
  , gaze        = require('gaze')           // watching files
  , hapi        = require('hapi')           // http framework
  , jade        = require('jade')           // html templates
  , path        = require('path')           // path operation
  , redis       = require('redis')          // fast datastore
  , stylus      = require('stylus')         // css preprocess
  , templatizer = require('templatizer')    // glue templates
  , tmp         = require('tmp')            // get temp files
  , vm          = require('vm');            // eval templates


// https://github.com/raszi/node-tmp#graceful-cleanup
tmp.setGracefulCleanup();


// https://github.com/tlrobinson/long-stack-traces
require('long-stack-traces');


// main application class
var Application = function (projectFile) {

  // if a project file has been specified, open it
  if (projectFile) {
    var p = path.resolve(projectFile)
    console.log('Opening session', p);
    this.projectFile = p;
  } else {
    this.projectFile = null;
  }

  // create sandboxed context for server-side execution of projects
  this.projectVM = vm.createContext(require('./project-context.js'));

  // global state
  this.redisServer = null;
  this.redisClient = null;
  this.httpServer  = null;
  this.templates   = null;

  // use closures to avoid repeated .bind()-ing
  var app = this;

  // launcg redis server on a free port
  freeport(function (err, port) {

    if (err) throw err;

    app.startRedis(port);

  });

};


Application.prototype = {

  constructor: Application,

  startRedis: function (port) {

    var app = this;

    // start redis server process
    app.redisServer = child.spawn(
      'redis-server',
      [ '--port', port ],
      { stdio: [ 'ignore'
               , 'pipe'
               , 'pipe' ] } );

    // connect to redis
    // FIXME: execute callback only once
    app.redisServer.stdout.on('data', function () {

      if (this.redisClient) return;

      app.redisClient = redis.createClient(
        port,
        '127.0.0.1',
        {});

      app.compileTemplates(path.join('.', 'modules'));

      app.compileStylesheets(path.join('.', 'modules'));

      app.startWatcher();

      app.startServer();

    });

  },

  startWatcher: function () {

    var app = this;

    if (app.watcher) return;

    // watch modules directory for changes
    app.watcher = gaze('modules/**/*', function (err, watcher) {

      if (err) throw err;

      var endsWith = function (a, b) {
        return a.indexOf(b) === (a.length - b.length);
      }

      this.on('all', function (event, filepath) {

        console.log(filepath, event);

        if (endsWith(filepath, '.jade')) {

          app.compileTemplates(path.dirname(filepath));

        } else if (endsWith(filepath, '.styl')) {

          app.compileStylesheets(path.dirname(filepath));

        }

      });

    });

  },

  startServer: function () {

    var app = this;

    if (app.httpServer) return;

    app.httpServer = new hapi.Server();
    app.httpServer.connection({ port: 4000 });

    for (var i in app.serverRoutes) {
      var route = app.serverRoutes[i];
      if (route.handler.bind) route.handler = route.handler.bind(app);
      console.log("Registering route", route.method || "GET", route.path);
      app.httpServer.route(route);
    }

    app.httpServer.start(function () {
      console.log('Server running at:', app.httpServer.info.uri);
    });

  },

  compileTemplates: function (srcdir) {

    // all compiled jade templates are concatenated together by
    // templatizer (https://github.com/HenrikJoreteg/templatzer).
    // it can only write them to a file, though, so we use tmp as
    // a momentary workaround to read them into redis.

    console.log("Compiling templates.");

    var app = this;

    tmp.file(function (err, temppath) {

      if (err) throw err;

      templatizer(
        srcdir,
        temppath,
        { namespace:        'session'
        , dontRemoveMixins: true });

      fs.readFile(
        temppath,
        { encoding: 'utf8' },
        function (err, data) {
          if (err) throw err;
          app.redisClient.set('templates', data);
        });

      app.templates = require(temppath);

    });

  },

  compileStylesheets: function (srcdir) {

    console.log("Compiling stylesheets.");

    fs.readdir(srcdir, function (err, files) {

      var directories = files.filter(
        function (f) {
          try {
            return fs.statSync(path.join(srcdir, f)).isDirectory();
          } catch (e) {
            return false;
          }
        }
      );

      var styl = stylus('');

      styl.set('paths',    [srcdir]);
      styl.set('filename', 'style.css');

      styl.import('global');

      for (var i in directories) {
        var d = directories[i],
            p = path.join('modules', d, d + '.styl');
        if (fs.existsSync(p)) styl.import(d + '/' + d);
      };

      styl.render(function (err, css) {
        if (err) throw err;
        app.redisClient.set('stylesheet', css);
      });

    });

  },

  serverRoutes:
    [ { path:    '/'
      , method:  'GET'
      , handler: function (request, reply) {

          var app = this;

          app.redisClient.get('templates', function (err, templateData) {

            if (err) throw err;

            app.projectVM.session.components = [];
            app.projectVM.session.httpServer = app.httpServer;

            vm.runInContext(
              templateData +
              ';session.templates = session.templatizer' +
              ';delete session.templatizer',
              app.projectVM,
              '<redis_templates>');

            if (app.projectFile) {
              vm.runInContext(
                fs.readFileSync(app.projectFile),
                app.projectVM,
                app.projectFile);
            }

            console.log(app.projectVM.session);

            reply(app.projectVM.session.templates.app(
              app.projectVM.session));

          });

        } }

    , { path:    '/templates.js'
      , method:  'GET'
      , handler: function (request, reply) {

          var app = this;

          app.redisClient.get('templates', function (err, data) {

            if (err) throw err;

            reply(data).type('text/javascript');

          });

        } }

    , { path:    '/styles.css'
      , method:  'GET'
      , handler: function (request, reply) {

          var app = this;

          app.redisClient.get('stylesheet', function (err, data) {

            if (err) throw err;

            reply(data).type('text/css');

          })

        } }

    , { path:    '/modules/{module}'
      , method:  'GET'
      , handler: function (request, reply) {

          var app  = this
            , file = path.join('.'
                              , 'modules'
                              , request.params.module
                              , 'client.js');

          reply.file(file).type('text/javascript');

        }
      }

    , { path:   '/libs/{path*}'
      , method: 'GET'
      , handler: { directory: { path: 'bower_components/' } }
      }

    ]

}


module.exports = Application;


if (require.main === module) {

  var app = new Application(process.argv[2]);

}


// start watcher
//require('./core/gulpfile.js')();

// start server
//var server = require('./core/server.js')({

  //css: [ 'app/global.css'
       //, 'app/rack.css'
       //, 'app/timeline.css'
       //, 'app/transport.css' ],

  //js:  [ 'libs/reflux/dist/reflux.js' 
       //, 'libs/reqwest/reqwest.js'
       //, 'http://127.0.0.1:4000/socket.io/socket.io.js'
       //, 'app/osc.js'
       //, 'app/rack.js'
       //, 'app/timeline.js'
       //, 'app/transport.js'
       //, 'app/init.js'
       //]

//})

//server.start(function () {

  //console.log('Server running at:', server.info.uri);

//});
