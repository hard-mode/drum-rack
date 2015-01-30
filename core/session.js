var redis = require('redis')  // fast datastore
  , vm       = require('vm'); // eval isolation

var Session = function () {
  this.data = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  this.bus  = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  this.bus.subscribe('watcher');

  // create sandbox for session code
  //this.context = vm.createContext(
    //{ DATA: this.data
    //, BUS:  this.bus }

    // compile and execute session code
    //this.watcher.compileWisp(this.path);
    //this.watcher.add(this.path);
}
