var
  fs        = require('fs'),
  Hapi      = require('hapi'),
  Socket    = require('socket.io'),
  cp        = require('child_process'),
  osc       = require('node-osc'),
  freeport  = require('freeport'),
  templates = require('../client/templates.js');

var
  SAMPLE_DIR = '/mnt/data/Samplez/Drum Machine Samples/Alesis Hr16',
  SAMPLER    = '/home/epimetheus/code/hardmode/postmelodic/bin/sample_player',
  PADS       = {};

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
      fs.readdir(SAMPLE_DIR, function (err, files) {
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

    socket.on('load', function (pad, path) {
      var samplePath = SAMPLE_DIR + '/' + path;
      freeport(function(err, port) {
        console.log('load', samplePath, port);
        PADS[pad] = {
          process: cp.spawn(SAMPLER, ['-p', port, samplePath],
                            {stdio: 'inherit'}),
          osc: new osc.Client('localhost', port)
        };
      });
    });

    socket.on('play', function (pad) {
      if (PADS[pad]) {
        console.log('Hit pad', pad);
        PADS[pad].osc.send('/play', 0, 0);
      } else {
        console.log('Pad', pad, 'empty');
      }
    });

  });

  return server;

}
