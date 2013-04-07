
var Oscilloscope = require('./lib/oscilloscope').Oscilloscope
  , oscilloscope = new Oscilloscope(6)
  , util = require('util');

oscilloscope.on('data', function(data) {
  //console.log('data', util.inspect(data, false, 10));
});

oscilloscope.connect('Laser Rainbow', function(err, device) {
  if(err)
    console.error(err);
  else
    oscilloscope.start();
});