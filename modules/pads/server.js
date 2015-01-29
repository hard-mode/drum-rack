module.exports = function (Session) {

  var Pads = function (session, options) {
    this.session = session;
    this.client  = 'Pads';
    this.options = options;
  }

  Session.prototype.pads = function (options) {

    var t = new Pads(this, options);
    this._add(t);

    return this;

  }

}

