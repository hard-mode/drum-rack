(function(H) {

var HTMLToDOMNode = function (html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

H.Timeline = function (n) {

  document.body.innerHTML += H.TEMPLATES.timeline.Timeline(n); 

};


})(window.HARDMODE);
