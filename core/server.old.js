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

var ROUTES =
  [ { path:    '/'
    , method:  'GET'
    , handler: function(request, reply) {
        reply(templates.app({
          css: config.css,
          js:  config.js
        }));
      }
    }

  , { path:   '/app/{path*}',
    , method: 'GET',
    , handler: { directory: { path: 'client/' } }
    }

  , { path:   '/libs/{path*}'
    , method: 'GET'
    , handler: { directory: { path: 'bower_components/' } }
    }

  , { path:    '/static/{path*}'
    , method:  'GET'
    , handler: { directory: { path: 'static/' } }
    }

  , { path:    '/sample'
    , method:  'GET'
    , handler: function(request, reply) {
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
    }
  ];


module.exports = function (settings) {

  var config = {
    css: settings.css || [],
    js:  settings.js  || [],
  }

  var server = new Hapi.Server();
  server.connection({ port: 4000 });
  for (var i in ROUTES) server.route(ROUTES[i]);


  return server;

}
