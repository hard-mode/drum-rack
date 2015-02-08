(set! (aget window.HARDMODE "Rack")
  (fn [options & body]
    (let [template  (require "./rack.jade")
          rendered  (template options)
          element   (aget (HTMLToDOMNode rendered) "firstChild")
          children  (body.map (fn [c]
                      (element.appendChild (c :element)
                      c)))]
    (console.log "TEMPLATE" template)
    (console.log "RENDERED" rendered)
    (console.log "ELEMENT"  element)
    (console.log "CHILDREN" children)
    { :template template
      :rendered rendered
      :element  element
      :children children })))
