
var numChannels = 12;
var valueByteLength = 2;

// MessageParser
// ----------------
// Parses a HID message and turns it into a 12 channel object
var MessageParser = exports.MessageParser = function() {

};

MessageParser.prototype.reorganize = function(message) {
  return message.concat(message.splice(0, 8));
};

MessageParser.prototype.parse = function(message) {

  // copy and reorganize the message
  var msg = this.reorganize(message.slice());

  // empty the message of all frames
  var valuesPerFrame = numChannels * valueByteLength;
  var frames = [];
  var currentFrame = { channels: [] };
  var hasMoreFrames = (msg.length >= valuesPerFrame);

  while(hasMoreFrames) {

    // read bytes of value
    var val = this.mapBytes(msg.splice(0, valueByteLength));

    // add as a channel to the frame
    currentFrame.channels.push(val);

    // if channels are full, make a new frame
    if(currentFrame.channels.length === numChannels) {
      frames.push(currentFrame);

      if(msg.length >= valuesPerFrame) {
        currentFrame = { channels: [] };
      } else {
        hasMoreFrames = false;
      }
    }
  }

  return { frames: frames };
};

MessageParser.prototype.mapBytes = function(bytes) {
  return bytes
    .map(function(_byte, _index) {
      return _byte << 8 * _index;
    })
    .reduce(function(total, current) {
      return total + current;
    });
};
