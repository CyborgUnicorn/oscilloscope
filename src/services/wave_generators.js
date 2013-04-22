
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