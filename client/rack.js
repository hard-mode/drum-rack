(function(H) {

H.DrumRack = function () {

  document.body.innerHTML += H.TEMPLATES.rack.SampleRack(16); 

  var modal = null;

  var onKeyTyped = function () {
    var
      p = document.getElementById('search-results'),
      q = this.value;

    if (q.length == 0) return;

    reqwest({
      url: '/sample',
      method: 'get',
      data: { q: q },
      success: function (resp) {
        var s = '';
        for (var i in resp) {
          s += '<div>' + resp[i] + '</div>';
        }
        p.innerHTML = s;
      }
    });
  }

  var HTMLToDOMNode = function (html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }

  var browseSamples = function (pad) {
    if (modal) {
      modal.remove();
    }

    modal = HTMLToDOMNode(
      H.TEMPLATES.rack.SamplePicker(
        pad.offsetTop,   pad.offsetLeft,
        pad.offsetWidth, pad.offsetHeight)).firstChild;

    document.body.appendChild(modal);
  }

  var trigger = function (pad) {
  }

  var onPadClick = function () {
    if (this.classList.contains('empty')) {
      browseSamples(this);
    } else {
      trigger(this);
    }
  }

  var pads = document.getElementsByClassName('pad');

  for (var i = 0; i < pads.length; i++) {

    var pad = pads[i];

    pad.addEventListener('click', onPadClick.bind(pad));
  };

}

})(window.HARDMODE);
