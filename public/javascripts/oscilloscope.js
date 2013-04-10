/*! Oscilloscope - v0.0.1 - 2013-04-10 */
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

var ChannelSettingsController = function($scope) {

};

var ContentController = function($scope) {

  $scope.channels = [ { name: 'Channel 1' }, { name: 'Channel 2' } ];

  $scope.data = {
    channels: [
      { color: 'rgb(255, 0, 0)', y: 1024 },
      { color: 'rgb(0, 255, 0)', y: 1024 }
    ],
    frames: [
      { channels: [0, 100] },
      { channels: [100, 0] }
    ]
  };

};

angular
  .module( 'oscilloscope', [] )
  .directive( 'cuOsc', function ($timeout) {
    return {
      restrict: 'A',
      link: function( scope, element, attr ) {
        var canvas, context, width, height, sizeDirty, dataDirty;

        // When data changes, render
        scope.$watch('data', function() { dataDirty = true; }, true);

        // Create the drawing canvas
        function createCanvas() {
          canvas = document.createElement('canvas');
          element.append(canvas);
          context = canvas.getContext('2d');
          sizeDirty = true;
        }

        // Measure the size of the surrounding element
        function measure() {
          var w = element.width(), h = element.height();
          if(w !== width || h !== height) {
            width = w;
            height = h;
            sizeDirty = true;
          }
        }

        // Resize the canvas
        function resize() {
          sizeDirty = false;
          canvas.width = width;
          canvas.height = height;
        }

        // Check if render is needed
        function checkDirty() {
          if(!canvas || sizeDirty || dataDirty) {
            render();
          }
        }

        // Render the channels
        function render() {
          dataDirty = false;
          if(!canvas) { createCanvas(); }
          if(sizeDirty) { resize(); }

          context.clearRect(0, 0, width, height);
          for(var i=0; i<scope.data.channels.length; i++) {
            renderChannel(i);
          }
        }

        // Render a single channel
        function renderChannel(index) {
          var frames = scope.data.frames;
          var channel = scope.data.channels[index];

          context.strokeStyle = channel.color;
          context.beginPath();
          context.moveTo(0, height * frames[0].channels[index] / channel.y);
          for(var x=0; x<frames.length; x++) {
            var xVal = 100 * x;
            var yVal = height * frames[x].channels[index] / channel.y;
            context.lineTo(xVal, yVal);
          }
          context.stroke();
        }

        // Render loop
        $timeout(function checkRender() {
          measure();
          checkDirty();
          $timeout(checkRender, 50);
        }, 50);
      }
    };
  });