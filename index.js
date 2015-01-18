var
  fs       = require('fs'),
  gulp     = require('gulp'),
  gulpfile = require('./gulpfile.js'),
  Hapi     = require('hapi');

var server = new Hapi.Server();

server.connection({ port: 4000 });

server.route({
  method:  'GET',
  path:    '/',
  handler: function(request, reply) {
    reply.file('./dist/ui.html');
  }
});

server.route({
  method:  'GET',
  path:    '/static/{path*}',
  handler: { directory: { path: 'dist/' } }
});

server.route({
  method:  'GET',
  path:    '/sample',
  handler: function(request, reply) {
    console.log(request.query.q);
    fs.readdir('/mnt/data/Samplez/Drum Machine Samples/Alesis Hr16', function (err, files) {
      reply(files.filter(function (f) { return -1 !== f.toLowerCase().indexOf(request.query.q) }));
    })
  }
});

server.start(function () {
  gulp.start('default');
  console.log('Server running at:', server.info.uri);
});
