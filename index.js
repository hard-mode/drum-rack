var
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
  path:    '/{path*}',
  handler: { directory: { path: 'dist/' } }
});

server.start(function () {
  gulp.start('default');
  console.log('Server running at:', server.info.uri);
});
