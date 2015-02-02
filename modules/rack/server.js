module.exports = function () {
  var args = arguments;
  return function (context) {

    context.rack = new Rack(context, {name: args[0]});

    if (context.http) {
      context.http.title = args[0] + " :: " + context.http.title;
      context.http.init.push("var rack = new Rack()");
    }

    for (var i in args) {
      if (i == 0) continue;
      args[i](context);
    }

  }
};

var Rack = module.exports.Rack = function (context, options) {};
