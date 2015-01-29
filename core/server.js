var fs   = require('fs')   // filesystem ops
  , hapi = require('hapi') // http framework
  , vm   = require('vm');  // eval templates

var Server = module.exports = function (app) {

  this.app = app;

  this.server = new hapi.Server();
  this.server.connection({ port: 4000 });

  for (var i in this.routes) {
    var route = this.routes[i];
    if (route.handler.bind) route.handler = route.handler.bind(this);
    console.log("Registering route", route.method || "GET", route.path);
    this.server.route(route);
  }

  this.server.start(this.started.bind(this));

};

Server.prototype = {

  constructor: Server,

  started: function () {
    console.log('Server running at:', this.server.info.uri);
  },

  routes:
    [ { path:    '/'
      , method:  'GET'
      , handler: function (request, reply) {

          var app = this.app;
          reply("Hello world!");

          //app.datastore.get('templates', function (err, templateData) {

            //if (err) throw err;

            //vm.runInContext(
              //templateData +
              //';session.templates = session.templatizer' +
              //';delete session.templatizer',
              //app.projectVM,
              //'<redis_templates>');

            //if (app.projectFile) {
              //vm.runInContext(
                //fs.readFileSync(app.projectFile),
                //app.projectVM,
                //app.projectFile);
            //}

            //reply("Hello world!");

            ////reply(app.projectVM.session.templates.app(
              ////app.projectVM.session));

          //});

        } }

    , { path:    '/templates.js'
      , method:  'GET'
      , handler: function (request, reply) {

          var app = this;

          app.datastore.get('templates', function (err, data) {

            if (err) throw err;

            reply(data).type('text/javascript');

          });

        } }

    , { path:    '/styles.css'
      , method:  'GET'
      , handler: function (request, reply) {

          var app = this;

          app.datastore.get('stylesheet', function (err, data) {

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

};
