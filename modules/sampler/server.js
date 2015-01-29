/*
  , { path:    '/sample'
    , method:  'GET'
    , handler: function(request, reply) {
        console.log(request.query.q);
        fs.readdir(SAMPLE_DIR, function (err, files) {
          if (!err) {
            reply(files.filter(function (f) {
              return -1 !== f.toLowerCase().indexOf(request.query.q) &&
                     -1 === f.toLowerCase().indexOf('.asd') }));
          } else {
            console.log(err);
            reply(err);
          }
        })
      }
    }
  ];
*/

