session = {
  metadata: {},
  using:    {},
};

Session = function () {
  for (var i in arguments) {
    var arg = arguments[i];
    if (typeof(arg) === 'function') arg(session);
  };
};

Metadata = function (data) {
  return function (session) {
    for (var i in data) {
      session.metadata[i] = data[i];
    }
  }
};

Using = function () {
  var args = arguments;
  return function (session) {
    for (var i in args) {
      try {
        var p = path.resolve(path.join('modules', args[i], 'server.js'));
        session.using[args[i]] = require(p);
      } catch (e) {
        console.log('Could not find', p);
      }
      //console.log(p);
      //session.using[args[i]] = require('../modules/' + args[i] + 'server.js');
      //session.using.push(args[i]);
    }
  }
};
