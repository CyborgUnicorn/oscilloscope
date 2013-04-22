
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