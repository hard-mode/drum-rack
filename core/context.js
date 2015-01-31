config = {};

session = function () {

  if (arguments.length % 2 === 1)
    throw new Error('Arguments must be even.');
  for (var i = 0; i < arguments.length / 2; i++) {
    config[arguments[i * 2]] = arguments[i * 2 + 1];
  }

  if (config.use) {

    var path  = require('path')
      , redis = require('redis').createClient(process.env.REDIS, '127.0.0.1', {});

    for (var i = 0; i < config.use.length; i++) {
      var moduleName = config.use[i],
          modulePath = path.join('modules', moduleName, 'server.js');
      console.log("Using module", moduleName);
      redis.publish('using', modulePath);
      this[moduleName] = require(path.join('..', modulePath));
    }

  }

}.bind(this);

rack = function (name) { console.log("RACK", name, arguments) };
