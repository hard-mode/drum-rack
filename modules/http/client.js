(function (H) {

  window.HTMLToDOMNode = function (html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }

  var N = 16;

  //H.init = function () {
    //var transport = new H.Transport();
    //var drumRack  = new H.DrumRack(N);
    //var timeline  = new H.Timeline(N);
  //}

  //window.onload = H.init

})(window.HARDMODE = window.HARDMODE || {});
