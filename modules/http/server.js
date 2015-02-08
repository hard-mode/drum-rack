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

  this.title  = context.config.info.name;
  this.data   = context.data;
  this.port   = options.port;
  this.init   = [];
  this.server = new hapi.Server();
  this.server.connection({ port: options.port });

  for (var i in this.routes) {
    var route = this.routes[i];
    if (route.handler.bind) route.handler = route.handler.bind(this);
    console.log("Registering route", route.method || "GET",
                this.server.info.uri + route.path);
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

          console.log(this.port, this.title);

          reply(jade.renderFile(
            path.join(__dirname, 'index.jade'),
            { port:  this.port
            , title: this.title
            , init:  this.init }));

        } }

    , { path:    '/style'
      , method:  'GET'
      , handler: function (request, reply) {

          this.data.get('style', function (err, data) {
            if (err) throw err;
            reply(data).type('text/css');
          })

        } }

    , { path:    '/script'
      , method:  'GET'
      , handler: function (request, reply) {

          this.data.get('script', function (err, data) {
            if (err) throw err;
            reply(data).type('application/javascript');
          })

        } }

    , { path:    '/templates'
      , method:  'GET'
      , handler: function (request, reply) {

          this.data.get('templates', function (err, data) {
            if (err) throw err;
            reply(data).type('application/javascript');
          })

        } }

    , { path:    '/runtime'
      , method:  'GET'
      , handler: function (request, reply) {

          reply.file(path.resolve(
            path.join('node_modules', 'wisp', 'browser-embed.js')
          ));

        } }

    ]

};
