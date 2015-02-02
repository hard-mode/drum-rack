module.exports = function () {
  var args = arguments;
  return function (context) {

    context.rack = new Rack(context, {name: args[0]});

    context.http.scripts.push("modules/rack/client.js");

    for (var i in args) {
      if (i == 0) continue;
      args[i](context);
    }

  }
};

var Rack = module.exports.Rack = function (context, options) {};
