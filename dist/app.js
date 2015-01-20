function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var self = locals || {};
buf.push("<!DOCTYPE html><html><head>");
// iterate css
;(function(){
  var $$obj = css;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var stylesheet = $$obj[$index];

buf.push("<link rel=\"stylesheet\"" + (jade.attr("href", stylesheet, true, true)) + ">");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var stylesheet = $$obj[$index];

buf.push("<link rel=\"stylesheet\"" + (jade.attr("href", stylesheet, true, true)) + ">");
    }

  }
}).call(this);

buf.push("</head><body>");
// iterate js
;(function(){
  var $$obj = js;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var script = $$obj[$index];

buf.push("<script" + (jade.attr("src", js, true, true)) + "></script><script>document.body.innerHTML = template()</script>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var script = $$obj[$index];

buf.push("<script" + (jade.attr("src", js, true, true)) + "></script><script>document.body.innerHTML = template()</script>");
    }

  }
}).call(this);

buf.push("</body></html>");;return buf.join("");
}