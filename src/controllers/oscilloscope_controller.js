
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
