(set! (aget window.HARDMODE "Rack")
  (fn [options & body]
    (let [templates (require "./rack.jade")
          rendered  (templates.Rack options)
          element   (aget (HTMLToDOMNode rendered) "firstChild")
          children  (body.map (fn [c]
                      (element.appendChild (:element c)
                      c)))]
    (document.body.appendChild element)
    { :template templates.Rack
      :rendered rendered
      :element  element
      :children children })))
