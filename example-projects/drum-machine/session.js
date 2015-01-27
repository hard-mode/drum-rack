session

.info(
  { name:    'Drum Machine Demo',
    author:  'Mlad Konstruktor <fallenblood@gmail.com>',
    version: '0.0.1',
    key:     'C#m',
    tempo:   140 })

.use('rack',
     'osc',
     'pads',
     'sample-editor',
     'timeline',
     'transport',
     'mixer' )

//.osc()

.rack('Sequencing')

  .transport({ tempo: 140
             , meter: [4, 4] })

  .timeline({ tracks: 12 })

.end()

.rack('Sampling')

.end()

//

  //.transport.Transport({ tempo: 140 
                       //, meter: [4, 4]})

  //.timeline.Timeline({ tracks: 16 })

