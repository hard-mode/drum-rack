var path = require('path');


var Session = function () {
  this.using    = {};
  this.metadata = {};
  this.modules  = [];
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
        console.log('Using', p)
        this.using[arguments[i]] = require(p);
      } catch (e) {
        console.log('Could not find', p);
        this.using[arguments[i]] = null;
      }
    }
    return this;
  }

}


module.exports = {

  HARDMODE: {},

  session: new Session(),

};
