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
        'mixer')

  //function (session) {

    //console.log("FOO1");
    //return;

    //var u = session.using;

    //return u.rack.Rack('Sequencing',

      //u.transport.Transport({
        //tempo: function (session) {
          //return session.metadata.tempo },
        //meter: [4, 4] }),

      //u.timeline.Timeline({
        //tracks: 16 })

    //);

  //},

  //function (session) {

    //console.log("FOO2");
    //return;

    //var u = session.using;

    //return u.rack.Rack('Sampling',

      //u.pads.Pads({
        //grid: [4, 4] }),

      //u['sample-editor'].SampleEditor(),

      //u.mixer.Mixer({
        //tracks: 16 })

    //)

  //}

);
