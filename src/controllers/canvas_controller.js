
var CanvasController = function($scope) {
	
	var ctx = document.getElementById('plot').getContext('2d');
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.lineWidth = 1;
  var frames = [];
  var multiplicator = 30;

  var counter = 0;

  now.data = function(d) {
    d.frames.forEach(function(frame) {
      var channels = frame.channels.map(function(c) {
        return 600 - (c * 600 / 1024);
      });
      frames.push({ channels: channels, counter: counter++ });

      if(frames.length > 1500/multiplicator) {
        frames.shift();
      }
    });
  };

  var clear = function() {
    ctx.clearRect(0, 0, 1500, 620);
  };

  var draw = function(channel, color) {

    if(!frames.length) {
      return;
    }

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, frames[0].channels[channel]);
    
    for(var x=1; x<frames.length; x++) {
      ctx.lineTo(multiplicator*x, frames[x].channels[channel]);
      ctx.fillRect(multiplicator*x, frames[x].channels[channel], 2, 2);
    }
    ctx.stroke();
  };

  now.error = function(e) {
    console.log(e);
  };

  setInterval(function() {
    clear();
    draw(0, 'rgb(255, 0, 0)');
    //draw(1, 'rgb(0, 255, 0)');
  }, 33);

};