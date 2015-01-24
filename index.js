// start watcher
require('./server/gulpfile.js')();

// start server
var server = require('./server/server.js')({

  css: [ 'app/rack.css' ],

  js:  [ 'libs/reflux/dist/reflux.js' 
       , 'libs/reqwest/reqwest.js'
       , 'http://127.0.0.1:4000/socket.io/socket.io.js'
       , 'app/osc.js'
       , 'app/rack.js'
       , 'app/timeline.js'
       , 'app/transport.js'
       , 'app/init.js'
       ]

})

server.start(function () {

  console.log('Server running at:', server.info.uri);

});
