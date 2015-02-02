var forever  = require('forever-monitor') // runs eternally
  , freeport = require('freeport')        // get free ports
  , path     = require('path')            // path operation
  , redis    = require('redis')           // fast datastore


// https://github.com/tlrobinson/long-stack-traces
require('long-stack-traces');


var Launcher = module.exports = function (srcPath) {

  // determine session path
  if (srcPath) {
    this.path = path.resolve(srcPath);
    console.log('Opening session', this.path);
  } else {
    this.path = '';
    console.log('Starting new session.');
  }

  // get a free port for running a redis server
  freeport(function (err, port) {

    console.log("Starting Redis on port", port);

    var cache = this.cache = {
      server:  forever.start(
        ['redis-server', '--port', port],
        { silent:  true
        , pidFile: '/home/epimetheus/redis.pid' }) };

    var mon = this.cache.monitor = redis.createClient(port, '127.0.0.1', {});
    mon.monitor(function (err, res) {
      if (err) throw err;
      mon.on('monitor', this.onMonitor.bind(this));
    }.bind(this));

    var bus = this.cache.bus = redis.createClient(port, '127.0.0.1', {});
    var env = { REDIS: port, SESSION: this.path };
    Object.keys(this.tasks).map(function (taskName) {
      var task =
        { path:    this.tasks[taskName]
        , monitor: new (forever.Monitor)( this.tasks[taskName], { env: env } )};
      task.monitor.start();
      bus.subscribe(taskName);
      this.tasks[taskName] = task;
    }.bind(this));

    bus.on('message', function (channel, message) {
      if (this.onMessage[channel]) {
        (this.onMessage[channel].bind(this))(message);
      }
    }.bind(this));

 
  }.bind(this));
  
};


Launcher.prototype.tasks =
  { watcher: path.resolve('./core/watcher.js')
  , session: path.resolve('./core/session.js') };


Launcher.prototype.onMonitor = function (time, args) {
  if (args[0] === 'publish') console.log("PUBLISH ::", args.slice(1));
};


Launcher.prototype.onMessage = {
  'watcher': function (message) {
    var m = message.split(':');
    for (var i in this.tasks) {
      var p = this.tasks[i].path;
      if (m[1] && m[1].indexOf(p) === m[1].length - p.length) {
        console.log("  Restarting task ::", i);
        this.tasks[i].monitor.restart();
        return;
      }
    }
  }
};


// entry point
if (require.main === module) {
  var app = new Launcher(process.argv[2]);
};
