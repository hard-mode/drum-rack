(function(H) {

H.Rack = function (options) {

  this.el = HTMLToDOMNode(H.TEMPLATES.rack.rack.Rack(options)).firstChild;

  this.children = [];
  for (var i = 1; i < arguments.length; i++) {
    this.children.push(arguments[i]);
    this.el.appendChild(arguments[i].el);
  }

  document.body.appendChild(this.el);

}

})(window.HARDMODE);
