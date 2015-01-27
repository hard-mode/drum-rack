(function(H) {

H.Rack = function (options) {

  this.el = HTMLToDOMNode(H.TEMPLATES.rack.rack.Rack(options)).firstChild;
  document.body.appendChild(this.el);

}

})(window.HARDMODE);
