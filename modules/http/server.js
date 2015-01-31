var fs   = require('fs')   // filesystem ops
  , hapi = require('hapi') // http framework
  , vm   = require('vm');  // eval templates


module.exports = function () {
  var port   = arguments[0]
    , server = new Server({ port: port }); 

  return function (context) {
    context.http = { server: server };
    for (var i in arguments) {
      if (i == 0) continue;
      body[i](context);
    }
  }
}


var Server = module.exports.Server = function (config) {

  this.server = new hapi.Server();
  this.server.connection({ port: config.port });

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

          reply("Hello world!");

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
