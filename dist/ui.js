function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<!DOCTYPE html>");
var PAD_COUNT = 16
buf.push("<div class=\"rack\"><div class=\"pads\">");
var pad = 0
while (pad < PAD_COUNT)
{
pad++
buf.push("<div class=\"pad empty\"><div class=\"pad-play\"><div class=\"pad-play-icon\">▶</div><div class=\"pad-load-icon\">☺</div></div><div class=\"pad-load\">Load sample</div><div class=\"pad-controls\"><div class=\"pad-edit\">Edit</div><div class=\"pad-mute\">M</div><div class=\"pad-solo\">S</div></div></div>");
}
buf.push("</div><div class=\"editor\"><div class=\"editor-waveform\"></div><div class=\"editor-controls\"><div class=\"editor-section\"><div class=\"editor-section-title\">Info</div><div class=\"editor-field\">Path</div><div class=\"editor-field\">Format</div><div class=\"editor-section-title\">Playback</div><div class=\"editor-field\">Start</div><div class=\"editor-field\">End</div><div class=\"editor-field\">Loop</div></div><div class=\"editor-section\"><div class=\"editor-section-title\">Pitch</div><div class=\"editor-field\">Semi</div><div class=\"editor-field\">Cent</div><div class=\"editor-section-title\">Filter</div><div class=\"editor-field\">HP</div><div class=\"editor-field\">LP</div></div><div class=\"editor-section\"><div class=\"editor-section-title\">Output</div><div class=\"editor-field\">Pan</div><div class=\"editor-field\">Volume</div><div class=\"editor-field\">Mute</div><div class=\"editor-field\">Solo</div></div></div></div></div>");;return buf.join("");
}