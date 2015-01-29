var forever = require('forever-monitor') // runs eternally
  , path = require('path')               // path operation
  , vm   = require('vm');                // eval isolation


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

  // initialize components
  this.datastore = new (require('./datastore.js'))(this);
  this.watcher   = new (require('./watcher.js'  ))(this);
  this.watcher.compileWisp(this.path);
  this.watcher.add(this.path)

  // create sandbox for project code
  this.context = vm.createContext(
    { datastore: this.datastore
    , watcher:   this.watcher });

};


// entry point
if (require.main === module) {
  var app = new Session(process.argv[2]);
}
