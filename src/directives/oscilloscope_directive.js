
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