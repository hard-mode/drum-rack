var child       = require('child_process')  // spawning stuff
  , freeport    = require('freeport')       // get free ports
  , path        = require('path')           // path operation
  , redis       = require('redis')          // fast datastore

var Datastore = module.exports = function (app) {

  // launch redis server on a free port
  freeport(function (err, port) {

    if (err) throw err;

    // start redis server process
    this.redisServer = child.spawn(
      'redis-server',
      [ '--port', port ],
      { stdio: [ 'ignore'
               , 'pipe'
               , 'pipe' ] } );

    // connect to redis
    this.redisServer.stdout.on('data', function () {

      if (this.redisClient) return;

      this.redisClient = redis.createClient(
        port,
        '127.0.0.1',
        {});

    }.bind(this));

  }.bind(this));

};

Datastore.prototype = {

  constructor: Datastore,

  get: function () {
    this.redisClient.get.apply(this.redisClient, arguments);
  },

  set: function () {
    this.redisClient.set.apply(this.redisClient, arguments);
  }

};
