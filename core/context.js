initSession = function (config) {

  this.config = config;

  if (config.use) {

    var path  = require('path')
      , redis = require('redis').createClient(process.env.REDIS, '127.0.0.1', {});

    config.use.map(function(moduleName) {
      var modulePath = path.join('modules', moduleName, 'server.js');
      console.log("Using module", moduleName);
      redis.publish('using', modulePath);
      this[moduleName] = require(path.join('..', modulePath));
    }.bind(this));

  }

}.bind(this);


executeBody = function () {
  for (var i in arguments) {
    arguments[i]({ config: this.config
                 , data:   data });
  }
}.bind(this);
