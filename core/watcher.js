var fs          = require('fs')             // filesystem ops
  , gaze        = require('gaze')           // watching files
  , jade        = require('jade')           // html templates
  , stylus      = require('stylus')         // css preprocess
  , templatizer = require('templatizer')    // glue templates
  , tmp         = require('tmp')            // get temp files


// https://github.com/raszi/node-tmp#graceful-cleanup
tmp.setGracefulCleanup();

var endsWith = function (a, b) {
  return a.indexOf(b) === (a.length - b.length);
}

var Watcher = module.exports = function (app) {

  var self = this;

  var watchGlobs =
    [ 'core/**/*'
    , 'modules/**/*'
    , 'example-projects/**/*' ];

  this.gaze = gaze(watchGlobs, function (err, watcher) {

    if (err) throw err;

    watcher.on('all', function (event, filepath) {

      console.log(filepath, event);

      if (endsWith(filepath, '.jade')) {

        self.compileTemplates(path.dirname(filepath));

      } else if (endsWith(filepath, '.styl')) {

        self.compileStylesheets(path.dirname(filepath));

      } else if (endsWith(filepath, '.wisp')) {

        self.compileWisp(path.dirname(filepath));

      } 

    });

  });

};

Watcher.prototype = {

  constructor: Watcher,

  compileTemplates: function (srcdir) {

    // all compiled jade templates are concatenated together by
    // templatizer (https://github.com/HenrikJoreteg/templatzer).
    // it can only write them to a file, though, so we use tmp as
    // a momentary workaround to read them into redis.

    console.log("Compiling templates.");

    var app = this;

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
          app.datastore.set('templates', data);
        });

    });

  },

  compileStylesheets: function (srcdir) {

    console.log("Compiling stylesheets.");

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
        app.datastore.set('stylesheet', css);
      });

    });

  },

  compileWisp: function (srcdir) {

    console

  }

};
