module.exports = function (Session) {

  var Transport = function (session, options) {
    this.session = session;
    this.client  = 'Transport';
    this.options = options;
  }

  Session.prototype.transport = function (options) {

    var t = new Transport(this, options);
    this._add(t);

    return this;

  }

}
