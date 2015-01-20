function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var self = locals || {};
jade_mixins["picker"] = function(t, l, w, h){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var left  = Math.max(3, l - 60) + 'px'
var width = (w + 120)           + 'px'
var top   = (t + h + 6)         + 'px'
var style = 'left:'+left+';top'+top+';width'+width
buf.push("<div" + (jade.attr("style", style+';opacity:1', true, false)) + " class=\"modal\"><input style=\"width:100%\" placeholder=\"search...\"/><div class=\"search-results\"></div></div>");
};
jade_mixins["picker"](t, l, w, h);;return buf.join("");
}