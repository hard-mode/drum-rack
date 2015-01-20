var
  fs       = require('fs'),
  gulp     = require('gulp'),
  Hapi     = require('hapi'),
  gulpfile = require('./gulpfile.js'),
  doc      = require('./server/document.js'),
  server   = new Hapi.Server();

gulp.start('default');

server.connection({ port: 4000 });

server.route({
  method:  'GET',
  path:    '/',
  handler: function(request, reply) {
    reply(doc.build());
  }
});

server.route({
  method:  'GET',
  path:    '/app/{path*}',
  handler: { directory: { path: 'dist/' } }
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

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
