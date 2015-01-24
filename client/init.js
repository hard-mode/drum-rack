(function (H) {

  var N = 16;

  H.init = function () {
    var drumRack = new H.DrumRack(N);
    var timeline = new H.Timeline(N);
  }

  window.onload = H.init

})
(HARDMODE);
