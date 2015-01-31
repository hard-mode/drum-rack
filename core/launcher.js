var forever  = require('forever-monitor') // runs eternally
  , freeport = require('freeport')        // get free ports
  , path     = require('path')            // path operation
  , redis    = require('redis')           // fast datastore


// https://github.com/tlrobinson/long-stack-traces
require('long-stack-traces');


var TASKS = { watcher: path.resolve('./core/watcher.js')
            , session: path.resolve('./core/session.js') };


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

    console.log("Starting Redis on port", port);

    // start redis
    this.redis = forever.start(
      ['redis-server', '--port', port],
      { silent:  true
      , pidFile: '/home/epimetheus/redis.pid' });

    var bus = this.bus = redis.createClient(port, '127.0.0.1', {});

    // start child processes
    var tasks = this.tasks = {};
    for (var i in TASKS) {

      tasks[i] = new (forever.Monitor)
        ( TASKS[i]
        , { env: { REDIS:   port,
                   SESSION: this.path } } );
      tasks[i].start();

      bus.subscribe(i);

    }

    // core events
    bus.subscribe('core');
    bus.subscribe('using');

    // reload child process on code update
    bus.on('message', function (channel, message) {

      console.log("==>", channel, '::', message);

      if (channel === 'core' && message === 'reload') {

        for (var i in TASKS) {
          console.log('    Reloading', i + '.');
          tasks[i].restart();
        }
        console.log();

      } else {

        for (var i in TASKS) {
          if (channel === i && message === 'reload') {
            console.log('    Reloading', i + '.\n');
            tasks[i].restart();
            return;
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
