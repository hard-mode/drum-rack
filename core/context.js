initSession = function (config) {

  this.config = config;

  if (config.use) {

    var path  = require('path')
      , redis = require('redis').createClient(process.env.REDIS, '127.0.0.1', {});

    redis.publish(
      'using',
      config.use.map(function(moduleName) {
        var modulePath = path.join('modules', moduleName, 'server.js');
        console.log("Using module", moduleName);
        this[moduleName] = require(path.join('..', modulePath));
        return path.dirname(modulePath);
      }.bind(this))
    );

  }

}.bind(this);


executeBody = function () {
  for (var i in arguments) {
    var context =
      { config: this.config
      , data:   data }
    arguments[i](context);
  }
}.bind(this);
