module.exports = function (Session) {

  var Timeline = function (session, options) {
    this.session = session;
    this.client  = 'Timeline';
    this.options = options;
  }

  Session.prototype.timeline = function (options) {

    var t = new Timeline(this, options);
    this._add(t);

    return this;

  }

}
