var hid = require('node-hid')
  , EventEmitter = require('events').EventEmitter
  , util = require('util')
  , _ = require('underscore')
  , MessageParser = require('./messageParser').MessageParser;

// Oscilloscope
// ----------------
// Connects to the device and reads the data
var Oscilloscope = exports.Oscilloscope = function() {
  EventEmitter.call(this);

  this.shouldRead = false;
  this.isReading = false;
  this.parser = new MessageParser();

  _.bindAll(this);
};

// make event emitter
util.inherits(Oscilloscope, EventEmitter);

Oscilloscope.prototype.getAllDevices = function() {
  return hid.devices();
};

Oscilloscope.prototype.setDeviceFromPath = function(path) {
  this.device = new hid.HID(path);
  return this;
};

// ## Connect to device
Oscilloscope.prototype.connect = function(deviceName, callback) {
  if(this.device) {
    return this;
  }

  var _this = this;

  this.getAllDevices().forEach(function(device) {
    if(device.product === deviceName) {
      _this.setDeviceFromPath(device.path);
      return;
    }
  });

  if(!this.device) {
    callback('No such device');
  } else {
    callback(null, this.device);
  }

  return this;
};

// ## Disconnect from device
Oscilloscope.prototype.disconnect = function() {
  this.stop();
  this.device = null;
  this.emit('disconnect');
};

// ## Start reading data from the device
Oscilloscope.prototype.start = function() {
  if(this.isReading) {
    return;
  }
  this.shouldRead = true;
  this.read();
};

Oscilloscope.prototype.read = function() {
  this.isReading = true;
  this.device.read(this.onData);
};

Oscilloscope.prototype.onData = function(err, data) {
  if(err) {
    this.emit('error', err);
    this.disconnect();
    this.tryReconnect();
  } else if(data && this.shouldRead) {
    this.emit('data', parser.parse(data));
  }
  
  if(this.shouldRead) {
    this.read();
  } else {
    this.isReading = false;
  }
};

Oscilloscope.prototype.tryReconnect = function() {
  
};

Oscilloscope.prototype.stop = function() {
  this.shouldRead = false;
};