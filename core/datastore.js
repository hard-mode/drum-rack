var forever     = require('forever-monitor') // runs eternally
  , freeport    = require('freeport')        // get free ports
  , path        = require('path')            // path operation
  , redis       = require('redis')           // fast datastore

var Datastore = module.exports = function (app) {

  // launch redis server on a free port
  freeport(function (err, port) {

    if (err) throw err;

    this.server = forever.start(
      ['redis-server', '--port', port],
      { pidFile: '/home/epimetheus/redis.pid' });

    // connect to redis
    this.server.on('start', function () {
      this.client = redis.createClient(
        port, '127.0.0.1', {});
    }.bind(this));

  }.bind(this));

};

Datastore.prototype = {

  constructor: Datastore,

  get: function () {
    this.client.get.apply(this.redisClient, arguments);
  },

  set: function () {
    this.client.set.apply(this.redisClient, arguments);
  }

};
