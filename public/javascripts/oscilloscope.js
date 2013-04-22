/*! Oscilloscope - v0.0.1 - 2013-04-22 */
(function() {

	'use strict';

	angular.module('oscilloscope', []);

})();

(function() {

	'use strict';

	var ChannelSettingsController = function($scope) {

	};

	angular.module('oscilloscope').controller('ChannelSettingsController', ChannelSettingsController);

})();

(function() {

  'use strict';

  var OscilloscopeController = function($scope, waveGenerators, $timeout) {

    $scope.oscilloscope = {
      lines: 4,
      channels: [
        {
          name: 'Channel 1',
          color: 'rgb(255, 0, 0)',
          max: 1024,
          amplitude: 1,
          freq: 1,
          yOffset: 0
        },
        {
          name: 'Channel 2',
          color: 'rgb(0, 255, 0)',
          max: 1024,
          amplitude: 1,
          freq: 1,
          yOffset: 0
        },
        {
          name: 'Channel 3',
          color: 'rgb(0, 0, 255)',
          max: 1024,
          amplitude: 1,
          freq: 1,
          yOffset: 0
        }
      ],
      frames: [ { channels: [] } ]
    };
    
    var generator1 = waveGenerators.get('triangle', 100, 924);
    var generator2 = waveGenerators.get('sawtooth', 100, 924);
    var generator3 = waveGenerators.get('sine', 100, 924);

    var reads = 0;

    /*now.data = function(data) {
      if(reads++ < 6) {
        console.log(data.frames.map(function(f) { return f.channels[0]; }));
      }
      for(var i=0; i<data.frames.length; i++) {
        $scope.oscilloscope.frames.push(data.frames[i]);
        if($scope.oscilloscope.frames.length > 1000) {
          $scope.oscilloscope.frames.shift();
        }
      }
    };*/
    
    $timeout(function generate() {
      
      for(var i=0; i<2; i++) {
        $scope.oscilloscope.frames.push({ channels: [ generator1.next(), generator2.next(), generator3.next() ] });

        if($scope.oscilloscope.frames.length > 1000) {
          $scope.oscilloscope.frames.shift();
        }
      }

      $timeout(generate, 1);
    }, 1);

  };

  angular.module('oscilloscope').controller('OscilloscopeController', OscilloscopeController);

})();


(function() {

	'use strict';

	var ScreenController = function($scope) {
	
		$scope.data = $scope.oscilloscope;

	};

	angular.module('oscilloscope').controller('ScreenController', ScreenController);

})();


(function() {

  var oscilloscope = function ($timeout) {
    return {
      restrict: 'A',
      link: function( scope, element, attr ) {
        var canvas, gridCanvas, context, gridContext, width, height, sizeDirty, dataDirty, gridRendered;

        // When data changes, render
        scope.$watch('data', function() { dataDirty = true; }, true);

        // Create the drawing canvas
        function createCanvas() {

          gridCanvas = document.createElement('canvas');
          gridCanvas.setAttribute('class', 'screen');
          element.append(gridCanvas);
          gridContext = gridCanvas.getContext('2d');

          canvas = document.createElement('canvas');
          canvas.setAttribute('class', 'screen');
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

          gridCanvas.width = width;
          gridCanvas.height = height;
        }

        // Check if render is needed
        function checkDirty() {
          if(!canvas || sizeDirty || dataDirty) {
            render();
            if(!gridRendered) {
              gridRendered = true;
              renderGrid();
            }
          }
        }

        // Render the channels
        function render() {
          dataDirty = false;
          if(!canvas) { createCanvas(); }
          if(sizeDirty) { resize(); }

          context.clearRect(0, 0, width, height);
          for(var i=0; i<scope.data.channels.length; i++) {
            context.save();
            renderChannel(i);
            context.restore();
          }
        }

        // Render a single channel
        function renderChannel(index) {
          var frames = scope.data.frames;
          var channel = scope.data.channels[index];
          var points = Math.ceil(width / channel.freq);
          var start = Math.max(0, frames.length - points);

          var yOffset = channel.yOffset * height + height/2 - height * channel.amplitude/2;

          var calcY = function(val) {
            return height - yOffset - (channel.amplitude * height * val / channel.max);
          };

          context.strokeStyle = channel.color;
          context.beginPath();
          context.moveTo(0, calcY(frames[0].channels[index]));
          for(var x=start; x<frames.length; x++) {
            var xVal = (x - start) * channel.freq;
            var yVal = calcY(frames[x].channels[index]);
            context.lineTo(xVal, yVal);
          }
          context.stroke();
        }

        // Render the grid
        function renderGrid() {
          var lines = 2 * scope.data.lines;
          gridContext.strokeStyle = 'rgb(200, 200, 200)';
          var step = height / lines;
          for(var i = 0; i < lines + 1; i++) {
            var y = Math.round(i * step);
            gridContext.lineWidth = (i === scope.data.lines) ? 2 : 0.5;
            gridContext.beginPath();
            gridContext.moveTo(0, y);
            gridContext.lineTo(width, y);
            gridContext.stroke();
          }

          var middle = width / 2;
          var xoffset = 0;

          gridContext.lineWidth = 2;

          gridContext.beginPath();
          gridContext.moveTo(middle, 0);
          gridContext.lineTo(middle, height);
          gridContext.stroke();

          gridContext.lineWidth = 0.5;

          while(xoffset < middle) {
            xoffset += step;

            gridContext.beginPath();
            gridContext.moveTo(middle - xoffset, 0);
            gridContext.lineTo(middle - xoffset, height);
            gridContext.stroke();

            gridContext.beginPath();
            gridContext.moveTo(middle + xoffset, 0);
            gridContext.lineTo(middle + xoffset, height);
            gridContext.stroke();
          }
        }

        // Render loop
        $timeout(function checkRender() {
          measure();
          checkDirty();
          $timeout(checkRender, 10);
        }, 10);
      }
    };
  };

  angular.module('oscilloscope').directive('cuOsc', oscilloscope);

})();

(function() {

	'use strict';

	angular.module('oscilloscope').factory('lazerRainbow', function() {

		var listeners = [];

		var connector = {
			connect: function() {
				now.connect();
			},
			disconnect: function() {
				now.disconnect();
			},
			onData: function(callback) {
				listeners.push(listener);
			}
		};

		now.data = function(data) {
			listeners.forEach(function(callback) {
				callback(data.frames);
			});
		};

		return connector;
	});

})();

(function() {

  'use strict';

  var TriangleWaveGenerator = function(min, max) {
    this.min = min;
    this.max = max;
    this.currentPosition = min;
    this.direction = 1;
  };

  TriangleWaveGenerator.prototype.next = function() {
    var value = this.currentPosition;

    this.currentPosition += this.direction;
    if(this.currentPosition >= this.max) {
      this.direction = -1;
    } else if(this.currentPosition <= this.min) {
      this.direction = 1;
    }

    return value;
  };

  var SawToothWaveGenerator = function(min, max) {
    this.min = min;
    this.max = max;
    this.currentPosition = min;
  };

  SawToothWaveGenerator.prototype.next = function() {
    var value = this.currentPosition;

    this.currentPosition += 1;
    if(this.currentPosition > this.max) {
      this.currentPosition = this.min;
    }

    return value;
  };

  var SineWaveGenerator = function(min, max) {
    this.min = min;
    this.max = max;
    this.currentPosition = 0;
  };

  SineWaveGenerator.prototype.next = function() {
    var amplitude = this.max - this.min;
    var value = this.min + amplitude/2 + (amplitude/2) * Math.sin(Math.PI * this.currentPosition / 180);
    this.currentPosition++;
    return value;
  };

  angular.module('oscilloscope').factory('waveGenerators', function() {
    return {
      get: function(type, min, max) {
        switch(type) {
          case 'triangle':
            return new TriangleWaveGenerator(min, max);
          case 'sawtooth':
            return new SawToothWaveGenerator(min, max);
          case 'sine':
            return new SineWaveGenerator(min, max);
            
        }
      }
    };
  });

})();