
var SineGenerator = exports.SineGenerator = function(maxValue, channels, frames) {
  this.maxValue = maxValue;
  this.channels = channels;
  this.frames = frames;

  this.position = 0;
  this.wait = 2;
};

SineGenerator.prototype.read = function(callback) {
  callback(null, this.getFrameBytes());
};

SineGenerator.prototype.getFrameBytes = function() {
  var frames = this.getFrames();

  // convert frames to byte array
};

SineGenerator.prototype.getFrames = function() {
  // generate sinewave frames for each channel
  var offset = 360 / this.channels;

  var result = [];
  
  for(var f = 0; f < this.frames; f++) {
    var frame = [];
    for(var c = 0; c < this.channels; c++) {
      var degPosition = this.position + c * offset;
      var val = maxValue * Math.sin(degPosition/(Math.PI * 2));
      frame.push(val);
    }
    result.push(frame);
    this.position++;
  }
};

SineGenerator.prototype.getBytesFromFrames = function(frames) {
  var mapBytes = this.mapBytes;
  return frames.map(function(frame) {
    return frame.map(mapBytes);
  })
  .reduce(function(total, current) {
    return total.push(current);
  });
};

SineGenerator.prototype.getBytes = function(number) {
  // convert a number into an array of bytes
};