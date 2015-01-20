// start watcher
var
  gulp     = require('gulp'),
  gulpfile = require('./server/gulpfile.js');
gulp.start('default');

// start server
var server = require('./server/server.js')({

  css: [ 'app/rack.css' ],

  js:  [ 'libs/reflux/dist/reflux.js' 
       , 'libs/reqwest/reqwest.js'
       , 'app/rack.js'
       , 'app/init.js'
       ]

})

server.start(function () {

  console.log('Server running at:', server.info.uri);

});
