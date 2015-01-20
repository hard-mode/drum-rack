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
        '<script>window.TEMPLATES["' + js + '"] = template;</script>';
    },


  buildStyles: function () {
    return [ 'app/ui.css' ].map(doc.wrapCSS).join('');
  },


  buildScripts: function () {
    return '<script>window.TEMPLATES = {};</script>' + 
      [ 'static/jade-runtime.js'
      , 'static/reqwest.js'
      ].map(doc.wrapJS).join('') +

      [ 'ui',
        'picker',
      ].map(doc.wrapJS2).join('') +

      '<script>window.onload = function () {' +
      'document.body.innerHTML = window.TEMPLATES["ui"]() }</script>';
  },


  build: function () {
    return doc.TEMPLATE.replace('[css]', doc.buildStyles())
                       .replace('[js]',  doc.buildScripts());
  }

}
