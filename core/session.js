var redis = require('redis') // fast datastore
  , vm    = require('vm');   // eval isolation

var Session = function () {
  
  this.data    = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  this.bus     = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  this.path    = process.env.SESSION;
  this.context = this.getSandboxContext();
  this.sandbox = vm.createContext(this.context);

  var data = this.data
    , bus  = this.bus;

  if (this.path) data.publish('session', 'open ' + this.path);

  // when watcher tells us that the session code
  // has been updated: tell main process to restart us
  bus.subscribe('watcher');
  bus.on('message', function (channel, message) {
    if (channel === 'watcher' && message === 'session') {
      console.log('Session updated.');
      data.publish('session', 'reload');
    }
  });

  // evaluate session code
  this.execute();

}


Session.prototype = {

  constructor: Session,

  getSandboxContext: function () {
    return { console: console
           , DATA:    this.data
           , BUS:     this.bus
           , PATH:    this.path };
  },

  execute: function () {
    var code = this.data.get('session', function (err, code) {
      this.data.publish('session', 'ready');
      vm.runInContext(code, this.sandbox, '<session>');
    }.bind(this));
  }

}


if (require.main === module) {
  var app = new Session();
}
