(function(H) {

var HTMLToDOMNode = function (html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

H.Timeline = function (n) {

  document.body.innerHTML += H.TEMPLATES.timeline.Timeline(n); 

  var tracks = document.getElementsByClassName('timeline-track');

  var actions = {
    cursor: Reflux.createActions([
      'keydown',
      'left',
      'right'
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

      left-=10;
      if (left < 0) left = 0;
      c.style.left = left + 'px';
      console.log(this.cursor.style.left);
    },

    right: function () {
      var c    = this.cursor,
          left = parseInt(c.style.left) || 0,
          w    = c.offsetParent.offsetWidth;

      left+=10;
      if (left >= w) left = w - 1;
      c.style.left = left + 'px';
      console.log(this.cursor.style.left);
    }

  });

  console.log(tracks);

};


})(window.HARDMODE);
