// let's start with some ugly-ass templating for the index page.
// only to bootstrap things, you see... it gets better below.

var doc;
doc = module.exports = {

  TEMPLATE:
    '<!doctype html><html><head>[css][js]</head><body></body></html>',


  wrapCSS:
    function (css){
      return '<link rel="stylesheet" href="' + css + '">'
    },

  wrapJS:
    function (js){
      return '<script src="' + js + '"></script>';
    },

  wrapJS2:
    function (js) {
      return doc.wrapJS('app/' + js + '.js') +
        '<script>window.HARDMODE.TEMPLATES["' + js + '"] = template;</script>';
    },


  buildStyles: function () {
    return [ 'app/rack.css' ].map(doc.wrapCSS).join('');
  },


  buildScripts: function () {
    return '<script>window.HARDMODE = { TEMPLATES: {} };</script>' + 
      [ 'static/jade-runtime.js'
      , 'static/reqwest.js'
      , 'client/init.js'
      , 'client/rack.js'
      , 'app/templates.js'
      ].map(doc.wrapJS).join('') +

      '<script>window.HARDMODE.TEMPLATES = window.HARDMODE.templatizer;' +
              'delete window.HARDMODE.templatizer;</script>' +

      [ 'rack',
        'picker',
      ].map(doc.wrapJS2).join('');
  },


  build: function () {
    return doc.TEMPLATE.replace('[css]', doc.buildStyles())
                       .replace('[js]',  doc.buildScripts());
  }

}
