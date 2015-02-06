(defmacro session [options & body]
  `(do (init-session! ~options)
       (execute-body! ~@body)))


(session

  { :use  [ "http" "rack" "transport" ]
    :info { :name   "Sampling Machine" 
            :author "Mlad Konstruktor <fallenblood@gmail.com>"} }

  (globals.modules.http 4000
    (globals.modules.rack "Sequencer"
      (globals.modules.transport :tempo  140
                 :meter [4 4] )))

  (globals.modules.http 4001
    (globals.modules.rack "Sampler"))

)
