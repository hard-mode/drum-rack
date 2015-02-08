module.exports = function () {
  var options = {};

  if (arguments.length % 2 === 1)
    throw new Error('Arguments must be even.');
  for (var i = 0; i < arguments.length / 2; i++) {
    options[arguments[i * 2]] = arguments[i * 2 + 1];
  }

  return function (context) {
    context.transport = new Transport(context, options);
    return "(HARDMODE.Transport)"
  }
}

var Transport = module.exports.Transport = function (context, options) {
  this.tempo = options.tempo;
  this.meter = options.meter;
}
