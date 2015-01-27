module.exports = {

  HARDMODE: {},

  console: console,

  session: {},

  Session: function () {

    for (var i in arguments) {
      var arg = arguments[i];
      arg(module.exports.session);
    };

  },

  Metadata: function (data) {
    return function (session) {
      session.metadata = data; // TODO extend
    }
  },

  Using: function (modules) {
    return function (session) {
      session.using = modules;
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
