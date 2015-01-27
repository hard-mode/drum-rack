var Socket   = require('socket.io'),
    child    = require('child_process'),
    osc      = require('node-osc'),
    freeport = require('freeport');

var oscServer, oscClient;

module.exports = function () {
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
          process: child.spawn(SAMPLER, ['-p', port, samplePath],
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
};
