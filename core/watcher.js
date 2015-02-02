var fs          = require('fs')             // filesystem ops
  , gaze        = require('gaze')           // watching files
  , jade        = require('jade')           // html templates
  , path        = require('path')           // path operation
  , redis       = require('redis')          // fast datastore
  , stylus      = require('stylus')         // css preprocess
  , templatizer = require('templatizer')    // glue templates
  , tmp         = require('tmp')            // get temp files
  , wisp        = require('wisp/compiler'); // lispy language


// https://github.com/raszi/node-tmp#graceful-cleanup
tmp.setGracefulCleanup();


var endsWith = function (a, b) {
  return a.indexOf(b) === (a.length - b.length);
}


var Watcher = module.exports = function () {

  var data = this.data = redis.createClient(process.env.REDIS, '127.0.0.1', {});
  var bus  = this.bus  = redis.createClient(process.env.REDIS, '127.0.0.1', {});

  this.gaze = gaze(
    [ 'core/**/*' ],
    this.initWatcher.bind(this));

  this.extra = {};

  this.bus.subscribe('using');
  this.bus.subscribe('session-open');
  this.bus.on('message', function (channel, message) {
    if (this.onMessage[channel]) {
      (this.onMessage[channel].bind(this))(message);
    }
  }.bind(this));

  this.compileStyles();
  this.compileScripts();
  this.compileSession(process.env.SESSION);

};


Watcher.prototype = {


  constructor: Watcher,


  onMessage: {

    'session-open': function (message) {
      this.extra['session'] =
        { dir:  path.dirname(message)
        , glob: message };
    },

    'using': function (message) {
      var modules = message.split(',');
      for (var i in modules) {
        var module = modules[i];
        this.extra[module] =
          { dir:  path.resolve(module)
          , glob: path.join(path.resolve(module), '**', '*') }
        this.gaze.add(this.extra[module].glob);
      }
    }

  },


  initWatcher: function (err, watcher) {

    if (err) throw err;
    this.data.publish('watcher', 'ready');
    watcher.on('all', this.onWatcherEvent.bind(this));

  },


  onWatcherEvent: function (event, filepath) {

    this.data.publish('watcher', event + ' ' + filepath); 

    if (endsWith(filepath, '.jade')) {
      this.compileTemplates(path.dirname(filepath));
    } else if (endsWith(filepath, '.js')) {
      this.compileScripts();
    } else if (endsWith(filepath, '.styl')) {
      this.compileStyles();
    } else if (endsWith(filepath, '.wisp')) {
      this.compileSession(filepath);
    }

    // editing any file in the core directory
    // triggers reload of watcher and session
    if (path.dirname(filepath) === __dirname) {
      this.data.publish('core', 'reload');
      return;
    };

    // editing any other file reloads session
    this.data.publish('session', 'reload');

  },


  compileTemplates: function (srcdir) {

    // all compiled jade templates are concatenated together by
    // templatizer (https://github.com/HenrikJoreteg/templatzer).
    // it can only write them to a file, though, so we use tmp as
    // a momentary workaround to read them into redis.

    console.log("Compiling templates.");

    var data = this.data;

    tmp.file(function (err, temppath) {

      if (err) throw err;

      templatizer(
        srcdir,
        temppath,
        { namespace:        'session'
        , dontRemoveMixins: true });

      fs.readFile(
        temppath,
        { encoding: 'utf8' },
        function (err, code) {
          if (err) throw err;
          data.set('templates', code);
          data.publish('watcher', 'templates');
        });

    });

  },


  compileStyles: function () {

    console.log("Compiling stylesheets.");

    var styl = stylus('');
    styl.set('filename', 'style.css');
    styl.import('modules/global');

    for (var i in this.extra) {
      var n = i.split('/')[1]
        , d = this.extra[i].dir
        , p = path.join(d, n + '.styl');
      if (fs.existsSync(p)) styl.import(d + '/' + n);
    }

    styl.render(function (err, css) {
      if (err) throw err;
      this.data.set('style', css);
      this.data.publish('watcher', 'style');
    }.bind(this));

  },


  compileScripts: function () {

    console.log("Compiling scripts.");

    var script = '';

    for (var i in this.extra) {
      var n = i.split('/')[1]
        , d = this.extra[i].dir
        , p = path.join(d, 'client.js');
      if (fs.existsSync(p)) script += fs.readFileSync(p, {encoding: 'utf8'}) + '\n';
    }

    this.data.set('script', script);

  },


  compileSession: function (src) {

    console.log('Compiling Wisp:', src);

    var data = this.data;

    fs.readFile(src, { encoding: 'utf8' }, function (err, source) {

      if (err) throw err;

      data.set('session', wisp.compile(source).code);
      data.publish('watcher', 'session');
 
    });

  }


};


if (require.main === module) {
  var app = new Watcher();
}
