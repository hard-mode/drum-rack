var path        = require('path')           // path operation
  , vm          = require('vm');            // eval templates


// https://github.com/tlrobinson/long-stack-traces
require('long-stack-traces');


// main application class
var Application = module.exports = function (projectFile) {

  // if a project file has been specified, open it
  if (projectFile) {

    var p = path.resolve(projectFile)
    console.log('Opening session', p);
    this.projectFile = p;

  } else {

    this.projectFile = null;

  }

  // create sandboxed context for server-side execution of projects
  this.projectVM = vm.createContext(require('./project-context.js'));

  // global state
  this.httpServer  = null;
  this.templates   = null;

  // initialize components
  this.datastore   = new (require('./datastore.js'))(this);
  this.httpServer  = new (require('./server.js'))(this);
  this.fileMonitor = new (require('./watcher.js'))(this);

};


if (require.main === module) {
  var app = new Application(process.argv[2]);
}
