var fs          = require('fs')             // filesystem ops
  , gaze        = require('gaze')           // watching files
  , jade        = require('jade')           // html templates
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
  bus.subscribe('session');

  var self = this;

  this.gaze = gaze('core/**/*', function (err, watcher) {

    if (err) throw err;

    data.publish('watcher', 'ready');
    bus.on('message', function (channel, message) {
      if (channel === 'session' && message.indexOf('open ') === 0 ) {
        var msg = message.split(' ')[1];
        watcher.add(msg);
        data.publish('watcher', 'added ' + msg)
      }
    });

    watcher.on('all', function (event, filepath) {

      data.publish('watcher', event + ' ' + filepath); 

      if (endsWith(filepath, '.jade')) {

        self.compileTemplates(path.dirname(filepath));

      } else if (endsWith(filepath, '.styl')) {

        self.compileStylesheets(path.dirname(filepath));

      } else if (endsWith(filepath, '.wisp')) {

        self.compileWisp(filepath);

      } 

    });

  });

};

Watcher.prototype = {

  constructor: Watcher,

  add: function () {
    this.gaze.add.apply(this.gaze, arguments);
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
        function (err, data) {
          if (err) throw err;
          data.set('templates', data);
          data.publish('watcher', 'templates');
        });

    });

  },

  compileStylesheets: function (srcdir) {

    console.log("Compiling stylesheets.");

    var data = this.data;

    fs.readdir(srcdir, function (err, files) {

      var directories = files.filter(
        function (f) {
          try {
            return fs.statSync(path.join(srcdir, f)).isDirectory();
          } catch (e) {
            return false;
          }
        }
      );

      var styl = stylus('');

      styl.set('paths',    [srcdir]);
      styl.set('filename', 'style.css');

      styl.import('global');

      for (var i in directories) {
        var d = directories[i],
            p = path.join('modules', d, d + '.styl');
        if (fs.existsSync(p)) styl.import(d + '/' + d);
      };

      styl.render(function (err, css) {
        if (err) throw err;
        data.set('stylesheet', css);
        data.publish('watcher', 'stylesheet');
      });

    });

  },

  compileWisp: function (src) {

    console.log('Compiling Wisp:', src);

    var data = this.data;

    fs.readFile(src, { encoding: 'utf8' }, function (err, data) {

      if (err) throw err;

      console.log(this.app.datastore);
      data.set('session', wisp.compile(data).code);
      data.publish('watcher', 'session')
 
    });

  }

};

if (require.main === module) {
  var app = new Watcher();
}
