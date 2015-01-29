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
session
  .rack('Sequencing')
    .transport(
      { tempo: session.metadata.tempo
      , meter: [4, 4] })
    .timeline(
      { tracks: 12 })
  .end()

session
  .rack('Sampling')
    .pads({ grid:   [4, 3],
            editor: sampleEditor() })
      .sample('/foo/kick.wav', { volume: -6.0            })
      .sample('/foo/hh.wav',   { volume: -12.0, pan: -50 })
      .sample('/foo/snare.wav' {                pan: 30  })
  .end()

session
  .rack('Mixer')
    .mixer({tracks: 12})
  .end()

//

  //.transport.Transport({ tempo: 140 
                       //, meter: [4, 4]})

  //.timeline.Timeline({ tracks: 16 })

