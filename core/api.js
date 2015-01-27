module.exports = {

  HARDMODE: {},

  console: console,

  session: {
    metadata: {},
    using:    [],
  },

  Session: function () {

    for (var i in arguments) {
      var arg = arguments[i];
      arg(module.exports.session);
    };

  },

  Metadata: function (data) {
    return function (session) {
      for (var i in data) {
        session.metadata[i] = data[i];
      }
    }
  },

  Using: function () {
    var args = arguments;
    return function (session) {
      for (var i in args) {
        session.using.push(args[i]);
      }
    }
  },

  Rack: function (modules) {
    return function (session) {
      console.log("RACK")
    }
  },

  Unit: function (modules) {
    return function (session) {
      console.log("UNIT")
    }
  },

}
