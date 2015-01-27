(function (H) {

  var script   = document.createElement('script');
  script.src   = '/socket.io/socket.io.js';
  script.async = true;

  script.addEventListener('load', function () {

    H.OSC = io.connect(
      '//localhost:4000',
      { port:              4000,
        rememberTransport: false });

    H.OSC.on('connect', function() {
      H.OSC.emit(
        'config',
        { server: { port: 3333,
                    host: '127.0.0.1' },
          client: { port: 3334,
                    host: '127.0.0.1' } } );
    });

    H.OSC.on('message', function(obj) {
      console.log(obj);
    });

  })

  document.body.appendChild(script);

})(HARDMODE);
