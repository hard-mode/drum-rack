module.exports = function () {

  var args = arguments;

  return function (context) {

    context.rack = new Rack(context, {name: args[0]});

    var init = '(HARDMODE.Rack "' + args[0] + '"';

    context.http.title = args[0] + " :: " + context.http.title;

    for (var i in args) {
      if (i == 0) continue;
      var result = args[i](context);
      if (result) init += ' ' + result;
    }

    init += ')';
    context.http.init.push(init);

  }

};

var Rack = module.exports.Rack = function (context, options) {};
