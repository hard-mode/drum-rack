Session(

  Metadata({
    name:    'Drum Machine Demo',
    author:  'Mlad Konstruktor <fallenblood@gmail.com>', 
    version: '0.0.1',
    key:     'C#m',
    tempo:   140 }),

  Using(
    'rack',
    'osc',
    'pads',
    'sample-editor',
    'timeline',
    'transport',
    'mixer'),

  Rack('Sequencer',

    Unit('transport.Transport', {
      tempo: function (session) {
        return session.metadata.tempo
      },
      meter: [4, 4] }
    ),

    Unit('timeline.Timeline', {
      tracks: 16 })),

  Rack('Sampler',
    Unit('pads.Pads',           { grid: [4, 4] }),
    Unit('sample-editor.Editor' ))

);
