var forever  = require('forever-monitor') // runs eternally
  , freeport = require('freeport')        // get free ports
  , path     = require('path')            // path operation
  , redis    = require('redis')           // fast datastore


// https://github.com/tlrobinson/long-stack-traces
require('long-stack-traces');


var TASKS = { watcher: './core/watcher.js'
            , session: './core/session.js' };


// main application class
var Application = module.exports = function (srcPath) {

  // if a project file has been specified, open it
  if (srcPath) {
    this.path = path.resolve(srcPath);
    console.log('Opening session', this.path);
  } else {
    this.path = null;
    console.log('Starting new session.');
  }

  // get a free port for running a redis server
  // TODO fixed port, pidfiles
  freeport(function (err, port) {

    console.log("Picked port", port);

    // start redis
    this.redis =
      { server: forever.start(
          ['redis-server', '--port', port],
          { pidFile: '/home/epimetheus/redis.pid' })
      , data:   redis.createClient(port, '127.0.0.1', {})
      , msg:    redis.createClient(port, '127.0.0.1', {}) };

    // start child processes
    var tasks = this.tasks = {};
    for (var i in TASKS) {
      tasks[i] = new (forever.Monitor)
        ( TASKS[i]
        , { env: { REDIS: port } } );
      tasks[i].start();
    }

    // keep track of what the watcher is doing
    this.redis.msg.subscribe('watcher');

    // restart child process on code update
    this.redis.msg.on('message', function (channel, message) {

      if (channel === 'watcher') {
        var msg = message.split(" ");
        if (msg.length === 1) {

          // TODO
 
        } else if (msg.length === 2) {

          for (var i in TASKS) {
            if (msg[1] === path.resolve(TASKS[i])) {
              tasks[i].restart();
            }
          }

        }
      }

    });
 
  }.bind(this));
  
};


// entry point
if (require.main === module) {
  var app = new Application(process.argv[2]);
}
