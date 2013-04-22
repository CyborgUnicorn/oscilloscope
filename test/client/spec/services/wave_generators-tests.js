
describe('WaveGenerators', function() {

  var waveGenerators;

  beforeEach(function() {
    module('oscilloscope');
    inject(function($injector) {
      waveGenerators = $injector.get('waveGenerators');
    });
  });

  describe('TriangleWaveGenerator', function() {

    var generator;

    beforeEach(function() {
      generator = waveGenerators.get('triangle', 1, 100);
    });

    it('returns a generator', function() {
      expect(generator).to.be.ok;
      expect(generator.next).to.be.a('function');
    });

    describe('#next', function() {

      it('starts at min', function() {
        expect(generator.next()).to.equal(1);
      });

      it('increments with 1', function() {
        expect(generator.next()).to.equal(1);
        expect(generator.next()).to.equal(2);
        expect(generator.next()).to.equal(3);
        expect(generator.next()).to.equal(4);
      });

      it('changes direction at max', function() {
        generator.currentPosition = 99;
        expect(generator.next()).to.equal(99);
        expect(generator.next()).to.equal(100);
        expect(generator.next()).to.equal(99);
        expect(generator.next()).to.equal(98);
      });

      it('changes direction at min', function() {
        generator.currentPosition = 2;
        generator.direction = -1;
        expect(generator.next()).to.equal(2);
        expect(generator.next()).to.equal(1);
        expect(generator.next()).to.equal(2);
        expect(generator.next()).to.equal(3);
      });

    });

  });

  describe('SawToothWaveGenerator', function() {

    var generator;

    beforeEach(function() {
      generator = waveGenerators.get('sawtooth', 1, 100);
    });

    it('returns a generator', function() {
      expect(generator).to.be.ok;
      expect(generator.next).to.be.a('function');
    });

    describe('#next', function() {

      it('starts at min', function() {
        expect(generator.next()).to.equal(1);
      });

      it('increments with 1', function() {
        expect(generator.next()).to.equal(1);
        expect(generator.next()).to.equal(2);
        expect(generator.next()).to.equal(3);
        expect(generator.next()).to.equal(4);
      });

      it('drops to min at max', function() {
        generator.currentPosition = 99;
        expect(generator.next()).to.equal(99);
        expect(generator.next()).to.equal(100);
        expect(generator.next()).to.equal(1);
        expect(generator.next()).to.equal(2);
      });

    });

  });

});