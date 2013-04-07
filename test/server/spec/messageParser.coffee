chai = require 'chai'
chai.should()

MessageParser = require('../../../lib/messageParser').MessageParser

describe 'MessageParser', ->

  beforeEach ->
    @parser = new MessageParser
    this
    @data = [ 255, 3, 255, 3, 255, 3, 255, 3, 240, 3, 221, 3, 255, 3, 255, 3, 255, 3, 255, 3, 230, 3, 208, 3, 255, 3, 255, 3, 255, 3, 255, 3, 207, 3, 171, 3, 255, 3, 255, 3, 255, 3, 255, 3, 213, 3, 175, 3, 255, 3, 255, 3, 255, 3, 255, 3, 233, 3, 206, 3, 255, 3, 255, 3, 255, 3, 255, 3, 242, 3, 225, 3, 255, 3, 255, 3, 255, 3, 255, 3, 232, 3, 211, 3, 255, 3, 255, 3, 255, 3, 255, 3, 208, 3, 173, 3, 255, 3, 255, 3, 255, 3, 255, 3, 196, 3, 154, 3, 255, 3, 255, 3, 255, 3, 255, 3, 233, 3, 204, 3 ]

  describe '#reorganize', ->

    it 'puts the first 8 values at the back', ->
      result = @parser.reorganize [1..10]
      result.should.eql [9, 10, 1, 2, 3, 4, 5, 6, 7, 8]

  describe '#mapBytes', ->

    it 'should add 8 bit shifted ints backwards', ->
      @parser.mapBytes([1, 2]).should.eql 513
      @parser.mapBytes([2, 1]).should.eql 258
      @parser.mapBytes([9, 10]).should.eql 2569

  describe '#parse', ->

    it 'creates a structure with 1 frame from 24 values', ->
      result = @parser.parse [1..24]
      result.frames.length.should.eql 1

    it 'creates a structure with 1 frame from 26 values', ->
      result = @parser.parse [1..26]
      result.frames.length.should.eql 1

    it 'creates a structure with 2 frames from 48 values', ->
      result = @parser.parse [1..48]
      result.frames.length.should.eql 2

    it 'creates a structure in which each frame has 12 channels', ->
      result = @parser.parse [1..49]
      
      result.frames[0].channels.length.should.eql 12
      result.frames[1].channels.length.should.eql 12

    it 'creates a structure with frames of the correct value', ->
      result = @parser.parse [1..24]

      firstVal = result.frames[0].channels[0]
      lastVal = result.frames[0].channels[11]

      # 1-8 is put at the back of the message. First values will be
      # 9 and 10. Expected is (10 << 8) + (9 << 0)
      firstVal.should.eql 513

    it 'creates a structure with the correct number of frames and channels', ->
      @parser = new MessageParser 6
      result = @parser.parse @data
      result.frames.length.should.equal 10
      result.frames[0].channels.length.should.equal 6
