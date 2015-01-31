module.exports = function () {

  var config = {};

  if (arguments.length % 2 === 1)
    throw new Error('Arguments must be even.');
  for (var i = 0; i < arguments.length / 2; i++) {
    config[arguments[i * 2]] = arguments[i * 2 + 1];
  }

  return new Transport(config);
}

var Transport = module.exports.Transport = function (config) {
  this.tempo = config.tempo;
  this.meter = config.meter;
}
