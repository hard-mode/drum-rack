session

.info({
  name:    'Drum Machine Demo',
  author:  'Mlad Konstruktor <fallenblood@gmail.com>', 
  version: '0.0.1',
  key:     'C#m',
  tempo:   140
})

.use(
  'rack',
  'osc',
  'pads',
  'sample-editor',
  'timeline',
  'transport',
  'mixer'
)


//.rack.Rack('Sequencing')

  //.transport.Transport({ tempo: 140 
                       //, meter: [4, 4]})

  //.timeline.Timeline({ tracks: 16 })

//.end()
