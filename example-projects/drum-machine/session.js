Session(

  Metadata({
    name:    'Drum Machine Demo',
    author:  'Mlad Konstruktor <fallenblood@gmail.com>', 
    version: '0.0.1',
    key:     'C#m',
    tempo:   140
  }),

  Using('rack',
        'osc',
        'pads',
        'sample-editor',
        'timeline',
        'transport',
        'mixer'),

  function (session) {

    var u         = session.using,
        Rack      = u.rack.Rack,
        Transport = u.transport.Transport,
        Timeline  = u.timeline.Timeline;

    Rack(
      'Sequencing',
      Transport({ tempo: 140, meter: [4,4] }),
      Timeline({ tracks: 16 })
    );

    //Rack(
      //'Sampling',
      //Pads({ grid: [4, 4] }),
      //Editor(),
      //Mixer({ tracks: 16 })
    //);

  }

);
