(set! (aget window.HARDMODE "Transport")
  (fn [options]
    (let [templates (require "./transport.jade")
          rendered  (templates.Transport options)
          element   (aget (HTMLToDOMNode rendered) "firstChild")]
    { :template templates.Transport
      :rendered rendered
      :element  element })))
