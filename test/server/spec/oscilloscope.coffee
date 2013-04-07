chai = require 'chai'
should = chai.should()

MessageParser = require('../../../lib/messageParser').MessageParser
Oscilloscope = require('../../../lib/oscilloscope').Oscilloscope

describe 'Oscilloscope', ->

  beforeEach ->
    @oscilloscope = new Oscilloscope

  describe '#ctor', ->
    it 'sets the correct defaults', ->
      @oscilloscope.shouldRead.should.be.false
      @oscilloscope.isReading.should.be.false
      @oscilloscope.parser.should.be.instanceOf MessageParser

  describe '#connect', ->

    beforeEach ->
      @oscilloscope.getAllDevices = () ->
        [
          { product: 'BaconShark', path: 'aaa111' },
          { product: 'LazerRainbow', path: 'bbb222' },
          { product: 'EpicTourettes', path: 'ccc333' }
        ]

      @oscilloscope.setDeviceFromPath = (path) ->
        this.device = path
        this


    it 'finds a device by name', (done) ->
      @oscilloscope.connect 'BaconShark', (err, device) =>
        device is 'aaa111'
        @oscilloscope.device is 'aaa111'
        done()

    it 'sends an error if device is not found', (done) ->
      @oscilloscope.connect 'HAL', (err, device) ->
        should.not.exist device
        err.should.equal 'No such device'
        done()

    it 'does not connect twice', ->
      connects = 0
      @oscilloscope.setDeviceFromPath = () ->
        this.device = 1
        connects++
        this
      @oscilloscope.connect 'LazerRainbow', () ->
      @oscilloscope.connect 'LazerRainbow', () ->
      connects.should.equal 1

  describe '#disconnect', ->
    it 'stops reading', (done) ->
      @oscilloscope.stop = () ->
        true.should.be.true
        done()
      @oscilloscope.disconnect()

    it 'clears the device', ->
      @oscilloscope.device = {}
      @oscilloscope.disconnect()
      should.not.exist @oscilloscope.device

  describe '#start', ->
    it 'sets shouldRead', ->
      @oscilloscope.isReading = false
      @oscilloscope.shouldRead = false
      @oscilloscope.read = () ->
      @oscilloscope.start()
      @oscilloscope.shouldRead.should.be.true

    it 'calls read', (done) ->
      @oscilloscope.read = () ->
        true.should.be.true
        done()
      @oscilloscope.start()

    it 'returns if isReading is true', ->
      

