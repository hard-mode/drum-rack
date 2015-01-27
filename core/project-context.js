var path = require('path');


var Session = function () {
  this.using      = {};
  this.metadata   = {};
  this.components = [];
};


Session.prototype = {

  constructor: Session,

  info: function (data) {
    for (var i in data) {
      this.metadata[i] = data[i];
    }
    return this;
  },

  use: function () {
    for (var i in arguments) {
      var p = path.resolve(path.join('modules', arguments[i], 'server.js'));
      try {
        console.log('\nUsing', p)
        this.using[arguments[i]] = require(p);
        this.using[arguments[i]](Session);
      } catch (e) {
        console.log('\nCould not load', p, 'because:\n', e);
        this.using[arguments[i]] = null;
      }
    }
    return this;
  },

  _add: function (component) {
    this.components.push(component);
  }

}


module.exports = {

  HARDMODE: {},

  session: new Session(),

};
