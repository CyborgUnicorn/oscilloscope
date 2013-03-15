
var channels = 12;
var frames = 5;

var MessageParser = exports.MessageParser = function() {

};

MessageParser.prototype.parse = function(message) {
  for(var frame = 0; frame < frames; frame++) {
    for(var channel = 0; channel < channels; channel++) {

    }
  }
};

MessageParser.prototype.combineInt = function(parts) {
  var result = 0;
  for(var i=parts.length -1; i>0; i--) {
    result += parts[i] << (8 * i);
  }
  return result;
};
