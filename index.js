var child    = require('child_process')
  , freeport = require('freeport')
  , fs       = require('fs')
  , gaze     = require('gaze')
  , jade     = require('jade')
  , path     = require('path')
  , redis    = require('redis')
  , stylus   = require('stylus');


var redisServer
  , redisClient;


freeport(function (err, port) {

  if (err) {
    console.log(err);
    return;
  }

  // start redis
  redisServer = child.spawn(
    'redis-server',
    [ '--port', port ],
    { stdio: [ 'ignore'
             , 'pipe'
             , 'pipe' ] } );

  // connect to redis
  redisServer.stdout.on('data', function () {

    if (redisClient) return;

    redisClient = redis.createClient(
      port,
      '127.0.0.1',
      {});

    // watch modules for changes
    gaze('modules/**/*', function (err, watcher) {

      var endsWith = function (a, b) {
        return a.indexOf(b) === (a.length - b.length);
      }

      this.on('all', function (event, filepath) {

        console.log(filepath, event);

        if (endsWith(filepath, '.jade')) {
        } else if (endsWith(filepath, '.styl')) {
        }

      })

    })

  });

})


// start watcher
//require('./core/gulpfile.js')();

// start server
//var server = require('./core/server.js')({

  //css: [ 'app/global.css'
       //, 'app/rack.css'
       //, 'app/timeline.css'
       //, 'app/transport.css' ],

  //js:  [ 'libs/reflux/dist/reflux.js' 
       //, 'libs/reqwest/reqwest.js'
       //, 'http://127.0.0.1:4000/socket.io/socket.io.js'
       //, 'app/osc.js'
       //, 'app/rack.js'
       //, 'app/timeline.js'
       //, 'app/transport.js'
       //, 'app/init.js'
       //]

//})

//server.start(function () {

  //console.log('Server running at:', server.info.uri);

//});
