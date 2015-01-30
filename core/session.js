var redis = require('redis') // fast datastore
  , vm    = require('vm');   // eval isolation

var Session = function () {
  
  var data  = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  var bus   = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  this.path = process.env.SESSION;

  this.context =
    { DATA: data
    , BUS:  bus
    , PATH: this.path };

  this.sandbox = vm.createContext(this.context);

  if (this.path) data.publish('session', 'open ' + this.path);

  bus.subscribe('watcher');
  bus.on('message', function (channel, message) {
    if (channel === 'watcher') {
      if (message === 'session') {
        console.log('Session updated.');
        data.publish('session', 'reload');
      }
    }
  });

  data.publish('session', 'ready');

  // create sandbox for session code
  //this.context = vm.createContext(
    //{ DATA: this.data
    //, BUS:  this.bus }

    // compile and execute session code
    //this.watcher.compileWisp(this.path);
    //this.watcher.add(this.path);
}

if (require.main === module) {
  var app = new Session();
}
