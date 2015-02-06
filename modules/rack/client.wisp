(let [H window.HARDMODE]

(set! (aget H "Rack")
  (fn [options & body]
    (let [template  H.TEMPLATES.rack.rack.Rack
          rendered  (template options)
          element   (aget (HTMLToDOMNode rendered) "firstChild")
          children  (body.map (fn [c]
                      (element.appendChild (c :element)
                      c)))]
    { :element  element
      :children children })))

)
