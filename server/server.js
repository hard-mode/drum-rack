var
  fs        = require('fs'),
  Hapi      = require('hapi'),
  templates = require('../client/templates.js');

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

  return server;

}
