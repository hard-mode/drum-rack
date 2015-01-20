(function(H) {

var HTMLToDOMNode = function (html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

H.DrumRack = function () {

  document.body.innerHTML += H.TEMPLATES.rack.SampleRack(16); 

  var actions = {

    pad: Reflux.createActions([
      'click',
      'play',
      'edit',
      'mute',
      'solo',
    ]),

    modal: Reflux.createActions([
      'open',
      'type',
      'search',
      'searchResults',
      'searchFailed',
      'select',
      'cancel'
    ])

  };

  var pad = Reflux.createStore({

    init: function () {
      this.pads  = {};
      this.listenToMany(actions.pad);
    },

    click: function (pad, event) {
      var n = pad.dataset.number;
      if (this.pads[n]) {
      } else {
        actions.modal.open(pad);
      }
    },

  });

  var modal = Reflux.createStore({

    init: function () {
      this.element = null;
      this.input   = null;
      this.timer   = null;
      this.results = null;
      this.listenToMany(actions.modal);
    },

    open: function (pad) {
      if (this.element) this.element.remove();
      this.element = document.body.appendChild(
        HTMLToDOMNode(
          H.TEMPLATES.rack.SamplePicker(
            pad.offsetTop,   pad.offsetLeft,
            pad.offsetWidth, pad.offsetHeight)).firstChild);
      this.input = this.element.getElementsByTagName('input')[0];
      this.input.addEventListener('input', actions.modal.type);
    },

    type: function () {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(actions.modal.search, 250);
    },

    search: function () {
      console.log(this.input.value);
      reqwest({
        url:     '/sample',
        method:  'get',
        data:    { q: this.input.value },
        success: actions.modal.searchResults,
        error:   actions.modal.searchFailed
      });
    },

    searchResults: function (resp) {
      var s = '';
      for (var i in resp) s += '<div class="search-result">' + resp[i] + '</div>';
      this.results = this.element.getElementsByTagName('div')[0];
      this.results.innerHTML = s;
      var results = this.results.getElementsByTagName('div');
      for (var i in results) {
        results[i].addEventListener('click', function (evt) {
          actions.modal.select(this, evt);
        }.bind(results[i]));
      }
    },

    select: function (elem, evt) {
      console.log(elem);
    }

  });

  var pads = document.getElementsByClassName('pad');
  for (var i = 0; i < pads.length; i++) {
    var pad = pads[i];
    pad.addEventListener('click', function (event) {
      actions.pad.click(this, event);
    }.bind(pad));
  };

}

})(window.HARDMODE);
