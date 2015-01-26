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
  , tmp         = require('tmp');           // get temp files


// https://github.com/raszi/node-tmp#graceful-cleanup
tmp.setGracefulCleanup();


var Application = function () {

  this.redisServer = null;
  this.redisClient = null;
  this.httpServer  = null;
  this.templates   = null;

  var app = this;

  freeport(function (err, port) {

    if (err) throw err;

    app.startRedis(port);

  });

};


Application.prototype = {

  constructor: Application,

  startRedis: function (port) {

    var app = this;

    // start redis
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

      app.startWatcher();

      app.startServer();

    });

  },

  startWatcher: function () {

    var app = this;

    // watch modules directory for changes
    gaze('modules/**/*', function (err, watcher) {

      if (err) throw err;

      var endsWith = function (a, b) {
        return a.indexOf(b) === (a.length - b.length);
      }

      this.on('all', function (event, filepath) {

        console.log(filepath, event);

        if (endsWith(filepath, '.jade')) {

          app.compileTemplates(path.dirname(filepath));

        } else if (endsWith(filepath, '.styl')) {

          // TODO compile stylesheets

        }

      });

    });

  },

  startServer: function () {
    // web server
    //httpServer = new hapi.Server();
    //httpServer.connection({ port: 4000 });
    //httpServer.route(
      //{ path:    '/'
      //, method:  'GET'
      //, handler: });
  },

  compileTemplates: function (srcdir) {

    // all compiled jade templates are concatenated together by
    // templatizer (https://github.com/HenrikJoreteg/templatzer).
    // it can only write them to a file, though, so we use tmp as
    // a momentary workaround to read them into redis.

    var app = this;

    tmp.file(function (err, temppath) {

      if (err) throw err;

      templatizer(
        srcdir,
        temppath,
        { namespace: 'HARDMODE'
        , dontRemoveMixins: true });

      fs.readFile(
        temppath,
        { encoding: 'utf8' },
        function (err, data) {
          if (err) throw err;
          app.redisClient.set('templates', data);
        });

      templates = require(temppath);

      console.log(templates)

    });

  }

}


module.exports = Application;


if (require.main === module) {

  var app = new Application();

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
