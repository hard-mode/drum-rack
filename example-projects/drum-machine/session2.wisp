(session

  :use [rack osc pads sample-editor timeline transport mixer]

  :info
    { :name    "Drum Machine Demo"
      :author  "Mlad Konstruktor <fallenblood@gmail.com>"
      :version "0.0.1"
      :key     key
      :tempo   tempo })

(let [transport (transport :tempo tempo
                           :key   key)
      timeline  (timeline)
      sampler   (sampler)]

  (rack "Sequencing"
    transport
    timeline)

  (rack "Sampling"
    (pads sampler)
    (sample-editor sampler))

  (rack "Mixer"
    (mixer sampler)))
