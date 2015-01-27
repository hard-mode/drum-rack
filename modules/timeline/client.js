(function(H) {

H.Timeline = function (options) {

  this.el = HTMLToDOMNode(H.TEMPLATES.timeline.timeline.Timeline(options)).firstChild;

  return;

  var actions = {
    cursor: Reflux.createActions([
      'keydown',
      'moveto',
      'left',
      'right'
    ]),
    track: Reflux.createActions([
      'click',
      'addclip'
    ])
  };

  var cursor = Reflux.createStore({

    init: function () {
      this.cursor = document.getElementsByClassName('timeline-cursor')[0];
      document.addEventListener('keydown', actions.cursor.keydown)
      this.listenToMany(actions.cursor);
    },

    keydown: function (evt) {
      if (evt.keyCode === 37) {
        actions.cursor.left();
      } else if (evt.keyCode === 39) {
        actions.cursor.right();
      }
    },

    left: function () {
      var c    = this.cursor,
          left = parseInt(c.style.left) || 0;
          w    = c.offsetParent.offsetWidth;

      left-=10;
      if (left < 0) left = w;
      c.style.left = left + 'px';
    },

    right: function () {
      var c    = this.cursor,
          left = parseInt(c.style.left) || 0,
          w    = c.offsetParent.offsetWidth;

      left+=10;
      if (left >= w) left = 0;
      c.style.left = left + 'px';
    }

  });

  var track = Reflux.createStore({

    init: function () {
      this.tracks = document.getElementsByClassName('timeline-track');
      for (var i = 0; i < this.tracks.length; i++) {
        var track = this.tracks[i];
        track.addEventListener('click', function (event) {
          actions.track.click(event, this);
        }.bind(track));
      }
      this.listenToMany(actions.track);
    },

    click: function (event, track) {
      var t = event.target;
      if (t.classList.contains('timeline-track-grid')) {
        actions.track.addclip(track, t);
      }
    },

    addclip: function (track, grid) {
      var clips = track.getElementsByClassName('timeline-track-clips')[0],
          clip  = document.createElement('div');
      clip.classList.add('timeline-track-clip');
      clip.style.left  = grid.offsetLeft  + 'px';
      clip.style.width = grid.offsetWidth + 'px';
      clips.appendChild(clip);
    }

  });

};


})(window.HARDMODE);
