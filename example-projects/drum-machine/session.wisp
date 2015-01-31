(session
  :use  ["http" "transport"]
  :info { :name "Sampling Machine" })

(http 4000
  (rack "Sequencing"
    (transport :tempo 140
               :meter [4 4] )))
