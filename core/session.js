var fs    = require('fs')    // filesystem ops
  , path  = require('path')  // path operation
  , redis = require('redis') // fast datastore
  , vm    = require('vm');   // eval isolation


var SessionLauncher = function () {
  
  this.data    = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  this.bus     = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  this.path    = process.env.SESSION;
  this.context = { process: process
                 , console: console
                 , require: require };
  this.sandbox = vm.createContext(this.context);

  var data = this.data
    , bus  = this.bus;

  if (this.path) data.publish('session-open', this.path);

  // when watcher tells us that the session code
  // has been updated: tell main process to restart us
  bus.subscribe('watcher');
  bus.on('message', function (channel, message) {
    if (channel === 'watcher' && message === 'session') {
      console.log('Session updated.');
      data.publish('session', 'reload');
    }
  });

  // evaluate session context code
  var code = fs.readFileSync(
    path.join(__dirname, 'context.js'), { encoding: 'utf8' });
  vm.runInContext(code, this.sandbox,'<session-context>');

  // evaluate session code
  var code = this.data.get('session', function (err, code) {
    this.data.publish('session', 'ready');
    vm.runInContext(code, this.sandbox, '<session>');
  }.bind(this));

}


if (require.main === module) {
  var app = new SessionLauncher();
}
