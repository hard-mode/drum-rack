var
  gulp     = require('gulp'),
  gulpfile = require('./server/gulpfile.js'),
  server   = require('./server/server.js');

gulp.start('default');

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
