(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root["HARDMODE"] === 'undefined' || root["HARDMODE"] !== Object(root["HARDMODE"])) {
        throw new Error('templatizer: window["HARDMODE"] does not exist or is not an object');
    } else {
        root["HARDMODE"].templatizer = factory();
    }
}(this, function () {
    var jade=function(){function r(r){return null!=r&&""!==r}function n(e){return Array.isArray(e)?e.map(n).filter(r).join(" "):e}var e={};return e.merge=function t(n,e){if(1===arguments.length){for(var a=n[0],s=1;s<n.length;s++)a=t(a,n[s]);return a}var i=n["class"],l=e["class"];(i||l)&&(i=i||[],l=l||[],Array.isArray(i)||(i=[i]),Array.isArray(l)||(l=[l]),n["class"]=i.concat(l).filter(r));for(var o in e)"class"!=o&&(n[o]=e[o]);return n},e.joinClasses=n,e.cls=function(r,t){for(var a=[],s=0;s<r.length;s++)a.push(t&&t[s]?e.escape(n([r[s]])):n(r[s]));var i=n(a);return i.length?' class="'+i+'"':""},e.attr=function(r,n,t,a){return"boolean"==typeof n||null==n?n?" "+(a?r:r+'="'+r+'"'):"":0==r.indexOf("data")&&"string"!=typeof n?" "+r+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'":t?" "+r+'="'+e.escape(n)+'"':" "+r+'="'+n+'"'},e.attrs=function(r,t){var a=[],s=Object.keys(r);if(s.length)for(var i=0;i<s.length;++i){var l=s[i],o=r[l];"class"==l?(o=n(o))&&a.push(" "+l+'="'+o+'"'):a.push(e.attr(l,o,!1,t))}return a.join("")},e.escape=function(r){var n=String(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return n===""+r?r:n},e.rethrow=function a(r,n,e,t){if(!(r instanceof Error))throw r;if(!("undefined"==typeof window&&n||t))throw r.message+=" on line "+e,r;try{t=t||require("fs").readFileSync(n,"utf8")}catch(s){a(r,null,e)}var i=3,l=t.split("\n"),o=Math.max(e-i,0),c=Math.min(l.length,e+i),i=l.slice(o,c).map(function(r,n){var t=n+o+1;return(t==e?"  > ":"    ")+t+"| "+r}).join("\n");throw r.path=n,r.message=(n||"Jade")+":"+e+"\n"+i+"\n\n"+r.message,r},e}();

    var templatizer = {};


    // app.jade compiled template
    templatizer["app"] = function tmpl_app(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(css, js, undefined) {
            buf.push("<!DOCTYPE html><html><head>");
            (function() {
                var $obj = css;
                if ("number" == typeof $obj.length) {
                    for (var $index = 0, $l = $obj.length; $index < $l; $index++) {
                        var stylesheet = $obj[$index];
                        buf.push('<link rel="stylesheet"' + jade.attr("href", stylesheet, true, true) + ">");
                    }
                } else {
                    var $l = 0;
                    for (var $index in $obj) {
                        $l++;
                        var stylesheet = $obj[$index];
                        buf.push('<link rel="stylesheet"' + jade.attr("href", stylesheet, true, true) + ">");
                    }
                }
            }).call(this);
            buf.push("</head><body>");
            (function() {
                var $obj = js;
                if ("number" == typeof $obj.length) {
                    for (var $index = 0, $l = $obj.length; $index < $l; $index++) {
                        var script = $obj[$index];
                        buf.push("<script" + jade.attr("src", js, true, true) + "></script><script>document.body.innerHTML = template()</script>");
                    }
                } else {
                    var $l = 0;
                    for (var $index in $obj) {
                        $l++;
                        var script = $obj[$index];
                        buf.push("<script" + jade.attr("src", js, true, true) + "></script><script>document.body.innerHTML = template()</script>");
                    }
                }
            }).call(this);
            buf.push("</body></html>");
        }).call(this, "css" in locals_for_with ? locals_for_with.css : typeof css !== "undefined" ? css : undefined, "js" in locals_for_with ? locals_for_with.js : typeof js !== "undefined" ? js : undefined, "undefined" in locals_for_with ? locals_for_with.undefined : typeof undefined !== "undefined" ? undefined : undefined);
        return buf.join("");
    };

    // picker.jade compiled template
    templatizer["picker"] = function tmpl_picker(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(Math) {}).call(this, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined);
        return buf.join("");
    };

    // picker.jade:picker compiled template
    templatizer["picker"]["picker"] = function tmpl_picker_picker(t, l, w, h) {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        var left = Math.max(3, l - 60) + "px";
        var width = w + 120 + "px";
        var top = t + h + 6 + "px";
        var style = "left:" + left + ";top:" + top + ";width:" + width;
        buf.push("<div" + jade.attr("style", style + ";opacity:1", true, false) + ' class="modal"><input style="width:100%" placeholder="search..."/><div class="search-results"></div></div>');
        return buf.join("");
    };

    // rack.jade compiled template
    templatizer["rack"] = function tmpl_rack(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        buf.push("<!DOCTYPE html>");
        var PAD_COUNT = 16;
        return buf.join("");
    };

    // rack.jade:sample-pad compiled template
    templatizer["rack"]["sample-pad"] = function tmpl_rack_sample_pad() {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        buf.push('<div class="pad empty"><div class="pad-play"><div class="pad-play-icon">▶</div><div class="pad-load-icon">☺</div></div><div class="pad-load">Load sample</div><div class="pad-controls"><div class="pad-edit">Edit</div><div class="pad-mute">M</div><div class="pad-solo">S</div></div></div>');
        return buf.join("");
    };


    // rack.jade:sample-editor compiled template
    templatizer["rack"]["sample-editor"] = function tmpl_rack_sample_editor() {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        buf.push('<div class="editor"><div class="editor-waveform"></div><div class="editor-controls"><div class="editor-section"><div class="editor-section-title">Info</div><div class="editor-field">Path</div><div class="editor-field">Format</div><div class="editor-section-title">Playback</div><div class="editor-field">Start</div><div class="editor-field">End</div><div class="editor-field">Loop</div></div><div class="editor-section"><div class="editor-section-title">Pitch</div><div class="editor-field">Semi</div><div class="editor-field">Cent</div><div class="editor-section-title">Filter</div><div class="editor-field">HP</div><div class="editor-field">LP</div></div><div class="editor-section"><div class="editor-section-title">Output</div><div class="editor-field">Pan</div><div class="editor-field">Volume</div><div class="editor-field">Mute</div><div class="editor-field">Solo</div></div></div></div>');
        return buf.join("");
    };


    // rack.jade:sample-rack compiled template
    templatizer["rack"]["sample-rack"] = function tmpl_rack_sample_rack() {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        buf.push('<div class="pads">');
        var pad = 0;
        while (pad < PAD_COUNT) {
            pad++;
            buf.push(templatizer["rack"]["sample-pad"]());
        }
        buf.push("</div>");
        buf.push(templatizer["rack"]["sample-editor"]());
        return buf.join("");
    };

    return templatizer;
}));