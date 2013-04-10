
var valueByteLength = 2;

// MessageParser
// ----------------
// Parses a HID message and turns it into a multi channel object
var MessageParser = exports.MessageParser = function(channels) {
  this.numChannels = channels || 12;
};

MessageParser.prototype.reorganize = function(message) {
  return message.concat(message.splice(0, 92));
};

MessageParser.prototype.parse = function(message) {

  // copy the message
  var msg = this.reorganize(message.slice());

  // empty the message of all frames
  var bytesPerFrame = this.numChannels * valueByteLength;
  var frames = [];
  var currentFrame = { channels: [] };
  var hasMoreFrames = (msg.length >= bytesPerFrame);

  while(hasMoreFrames) {

    // read bytes of value
    var val = this.mapBytes(msg.splice(0, valueByteLength));

    // add as a channel to the frame
    currentFrame.channels.push(val);

    // if channels are full, make a new frame
    if(currentFrame.channels.length === this.numChannels) {
      frames.push(currentFrame);

      if(msg.length >= bytesPerFrame) {
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
