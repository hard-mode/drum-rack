config = {};

session = function () {

  if (arguments.length % 2 === 1)
    throw new Error('Arguments must be even.');

  for (var i = 0; i < arguments.length / 2; i++) {
    config[arguments[i * 2]] = arguments[i * 2 + 1];
  }

}

rack = function (name) { console.log("RACK", name, arguments) };
