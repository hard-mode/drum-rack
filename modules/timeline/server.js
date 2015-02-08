module.exports = function () {

  var args = arguments;

  return function (context) {

    context.timeline = new Timeline();

    return "(HARDMODE.Timeline)";

  }

}

var Timeline = module.exports.Timeline = function (session, options) {
  this.session = session;
  this.client  = 'Timeline';
  this.options = options;
}
