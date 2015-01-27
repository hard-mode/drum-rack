module.exports = function (Session) {

  var Rack = function (session, name) {
    this.session    = session;
    this.name       = name;
    this.components = [];
  }

  Rack.prototype = {

    constructor: Rack,

    _add: function (component) {
      this.components.push(component);
    }

  }

  Session.prototype.rack = function (name) {

    // add rack to session components
    var r = new Rack(this, name);
    this._add(r);

    // rack takes over subsequent additions
    r._addToParent = this._add;
    this._add      = r._add;

    // until this method is called to end rack
    this.end = function () {
      this._add = r._addToParent;
      delete this.end;
      return this;
    }

    return this;

  }

}
