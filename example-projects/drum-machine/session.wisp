(defmacro session [options & body]
  `(do (init-session ~options)
       (execute-body! ~@body)))


(session

  { :use  [ "http" "rack" "transport" ]
    :info { :name   "Sampling Machine" 
            :author "Mlad Konstruktor <fallenblood@gmail.com>"} }

  (http 4000
    (rack "Sequencer"
      (transport :tempo  140
                 :meter [4 4] )))
  (http 4001
    (rack "Sampler"))

)
