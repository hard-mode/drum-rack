var
  fs        = require('fs'),
  Hapi      = require('hapi'),
  Socket    = require('socket.io'),
  osc       = require('node-osc'),
  templates = require('../client/templates.js');

var oscServer, oscClient;

module.exports = function (settings) {

  var config = {
    css: settings.css || [],
    js:  settings.js  || [],
  }

  var server = new Hapi.Server();

  server.connection({ port: 4000 });

  server.route({
    method:  'GET',
    path:    '/',
    handler: function(request, reply) {
      reply(templates.app({
        css: config.css,
        js:  config.js
      }));
    }
  });

  server.route({
    method: 'GET',
    path:   '/app/{path*}',
    handler: { directory: { path: 'client/' } }
  });

  server.route({
    method: 'GET',
    path:   '/libs/{path*}',
    handler: { directory: { path: 'bower_components/' } }
  });

  server.route({
    method:  'GET',
    path:    '/static/{path*}',
    handler: { directory: { path: 'static/' } }
  });

  server.route({
    method:  'GET',
    path:    '/sample',
    handler: function(request, reply) {
      console.log(request.query.q);
      fs.readdir('/run/media/epimetheus/Pomoika/Samplez/Drum Machine Samples/Alesis Hr16', function (err, files) {
        if (!err) {
          reply(files.filter(function (f) {
            return -1 !== f.toLowerCase().indexOf(request.query.q) &&
                   -1 === f.toLowerCase().indexOf('.asd') }));
        } else {
          console.log(err);
          reply(err);
        }
      })
    }
  });

  var io = Socket(server.listener);

  io.sockets.on('connection', function (socket) {

    socket.on('config', function (obj) {
      oscServer = new osc.Server(obj.server.port, obj.server.host);
      oscClient = new osc.Client(obj.server.host, obj.server.port);

      oscClient.send('/status', 'connected');

      oscServer.on('message', function (msg, rinfo) {
        console.log(msg, rinfo);
        socket.emit('message', msg);
      });

      socket.on('message', function (obj) {
        oscClient.send(obj);
      });

    })

  });

  return server;

}
