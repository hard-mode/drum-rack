(init-session!
  { :use  [ "http" "rack" "transport" ]
    :info { :name   "Sampling Machine" 
            :author "Mlad Konstruktor <fallenblood@gmail.com>"} })

(execute-body!

  (http 4000
    (rack "Sequencer"
      (transport :tempo 140
                 :meter [4 4] )))
  (http 4001
    (rack "Sampler"))

)
