.metadata({
  name:    'Drum Machine Demo',
  author:  'Mlad Konstruktor <fallenblood@gmail.com>', 
  version: '0.0.1',
  key:     'C#m',
  tempo:   140
})

.using(
  'rack',
  'osc',
  'pads',
  'sample-editor',
  'timeline',
  'transport',
  'mixer'
)

.rack(
  'Sequencing',
  function (s) {
    session.transport.Transport(),
    session.timeline.Timeline(),
  }
)
