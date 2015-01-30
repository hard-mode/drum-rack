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

  // determine session path
  if (srcPath) {
    this.path = path.resolve(srcPath);
    console.log('Opening session', this.path);
  } else {
    this.path = '';
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
      , msg:    redis.createClient(port, '127.0.0.1', {}) };
    var msg = this.redis.msg;

    // start child processes
    var tasks = this.tasks = {};
    for (var i in TASKS) {
      tasks[i] = new (forever.Monitor)
        ( TASKS[i]
        , { env: { REDIS:   port,
                   SESSION: this.path } } );
      tasks[i].start();
      msg.subscribe(i);
    }

    // restart child process on code update
    msg.on('message', function (channel, message) {
      console.log("==>", channel, '::', message);
      var msg = message.split(' ');
      if (channel === 'watcher' && msg.length === 2) {
        for (var i in TASKS) {
          tasks[i].restart();
        }
      }
    });
 
  }.bind(this));
  
};


// entry point
if (require.main === module) {
  var app = new Application(process.argv[2]);
}
