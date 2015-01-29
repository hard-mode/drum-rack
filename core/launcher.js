var forever  = require('forever-monitor') // runs eternally
  , freeport = require('freeport')        // get free ports
  , path     = require('path')            // path operation
  , redis    = require('redis')           // fast datastore
  , vm       = require('vm');             // eval isolation


// https://github.com/tlrobinson/long-stack-traces
require('long-stack-traces');


// main application class
var Session = module.exports = function (srcPath) {

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

    this.redis =
      { server: forever.start(
          ['redis-server', '--port', port],
          { pidFile: '/home/epimetheus/redis.pid' })
      , client: redis.createClient(
          port, '127.0.0.1', {}) };

    this.watcher = new (forever.Monitor)
      ( './watcher.js'
      , { env: { REDIS: port } } );

    // create sandbox for session code
    this.context = vm.createContext(
      { datastore: this.datastore
      , watcher:   this.watcher } );

    // keep track of what the watcher is doing
    this.redis.client.subscribe('watcher');
    this.redis.client.on('message', function (channel, message) {
      console.log("HEYO", channel, message);
    })

    // compile and execute session code
    //this.watcher.compileWisp(this.path);
    //this.watcher.add(this.path);
  
  }.bind(this));
  
};


// entry point
if (require.main === module) {
  var app = new Session(process.argv[2]);
}
