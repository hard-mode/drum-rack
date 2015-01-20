(function(H) {

H.DrumRack = function () {

  document.body.innerHTML += H.TEMPLATES['rack'](); 

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

  var browseSamples = function (pad) {
    if (modal) {
      modal.remove();
    }

    document.body.appendChild(H.TEMPLATES['picker'](
      pad.offsetTop,   pad.offsetLeft,
      pad.offsetWidth, pad.offsetHeight));

    //modal = document.createElement('div');
    //modal.classList.add('modal');
    //modal.style.left  = Math.max((pad.offsetLeft  -  60), 3) + 'px';
    //modal.style.width = (pad.offsetWidth + 120) + 'px';
    //modal.style.top   = (pad.offsetTop + pad.offsetHeight + 6) + 'px';
    //modal.style.opacity = 1;
    //console.log(modal);

    //var input = document.createElement('input');
    //input.style.width = '100%';
    //input.placeholder = 'search...';
    //input.addEventListener('input', onKeyTyped.bind(input));
    //modal.appendChild(input);

    //var div = document.createElement('div');
    //div.id = 'search-results';
    //div.style.overflow = 'auto';
    //modal.appendChild(div);

    //document.body.appendChild(modal);
  }

  var trigger = function (pad) {
  }

  var onPadClick = function () {
    if (this.classList.contains('empty')) {
      browseSamples(pad);
    } else {
      trigger(pad);
    }
  }

  var pads = document.getElementsByClassName('pad');

  for (var i = 0; i < pads.length; i++) {
    var pad = pads[i];
    pad.getElementsByClassName('pad-play')[0].addEventListener(
      'click',
      function () { browseSamples(this) }.bind(pad));
    console.log(pad.classList.contains('empty'));
  };

}

})(HARDMODE);
