var fs   = require('fs')   // filesystem ops
  , hapi = require('hapi') // http framework
  , path = require('path') // path operation
  , jade = require('jade') // html templates


module.exports = function () {
  var args = arguments;
  return function (context) {
    context.http = new Server(context, { port: args[0] });
    for (var i in args) {
      if (i == 0) continue;
      args[i](context);
    }
  }
}


var Server = module.exports.Server = function (context, options) {

  this.context = context;

  this.server = new hapi.Server();
  this.server.connection({ port: options.port });

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

          reply(jade.renderFile(
            path.join(__dirname, 'index.jade'),
            { metadata: this.context.config.info
            , using:    this.context.config.use }));

        } }

    , { path:    '/templates.js'
      , method:  'GET'
      , handler: function (request, reply) {

          this.context.data.get('templates', function (err, data) {
            if (err) throw err;
            reply(data).type('text/javascript');
          });

        } }

    , { path:    '/styles.css'
      , method:  'GET'
      , handler: function (request, reply) {

          this.context.data.get('stylesheet', function (err, data) {
            if (err) throw err;
            reply(data).type('text/css');
          })

        } }

    , { path:    '/modules/{module}'
      , method:  'GET'
      , handler: function (request, reply) {

          var file = path.join('.'
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
