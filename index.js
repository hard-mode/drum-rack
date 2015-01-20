var
  gulp     = require('gulp'),
  gulpfile = require('./server/gulpfile.js');
gulp.start('default');

var
  server   = require('./server/server.js');
server.start(function () {
  console.log('Server running at:', server.info.uri);
});
