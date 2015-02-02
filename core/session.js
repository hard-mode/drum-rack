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
                 , require: require
                 , data:    this.data };
  this.sandbox = vm.createContext(this.context);

  this.bus.subscribe('updated');
  this.bus.subscribe('session-open');

  this.bus.on('message', function (channel, message) {
    if (message === 'session') {
      this.data.get('session', function (err, sessionCode) {

        if (err) throw err;
        if (!sessionCode) return;

        // evaluate session context code
        vm.runInContext(
          fs.readFileSync(
            path.join(__dirname, 'context.js'),
            { encoding: 'utf8' }),
          this.sandbox,'<session-context>');

        // evaluate your actual session code
        vm.runInContext(sessionCode, this.sandbox, '<session>');

        // let the world know we're running
        this.data.publish('session', 'start');

      }.bind(this));
    }
  }.bind(this));

}


if (require.main === module) {
  var app = new SessionLauncher();
}
