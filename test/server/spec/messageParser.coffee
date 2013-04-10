chai = require 'chai'
chai.should()

MessageParser = require('../../../lib/messageParser').MessageParser

describe 'MessageParser', ->

  beforeEach ->
    @parser = new MessageParser
    this
    @data = [ 255, 3, 255, 3, 255, 3, 255, 3, 240, 3, 221, 3, 255, 3, 255, 3, 255, 3, 255, 3, 230, 3, 208, 3, 255, 3, 255, 3, 255, 3, 255, 3, 207, 3, 171, 3, 255, 3, 255, 3, 255, 3, 255, 3, 213, 3, 175, 3, 255, 3, 255, 3, 255, 3, 255, 3, 233, 3, 206, 3, 255, 3, 255, 3, 255, 3, 255, 3, 242, 3, 225, 3, 255, 3, 255, 3, 255, 3, 255, 3, 232, 3, 211, 3, 255, 3, 255, 3, 255, 3, 255, 3, 208, 3, 173, 3, 255, 3, 255, 3, 255, 3, 255, 3, 196, 3, 154, 3, 255, 3, 255, 3, 255, 3, 255, 3, 233, 3, 204, 3 ]

  describe '#reorganize', ->

    it 'herps and derps', ->
      result = @parser.reorganize [
        2,2,2,3,2,4,2,5,
        3,0,3,1,3,2,3,3,3,4,3,5,
        4,0,4,1,4,2,4,3,4,4,4,5,
        5,0,5,1,5,2,5,3,5,4,5,5,
        6,0,6,1,6,2,6,3,6,4,6,5,
        7,0,7,1,7,2,7,3,7,4,7,5,
        8,0,8,1,8,2,8,3,8,4,8,5,
        9,0,9,1,9,2,9,3,9,4,9,5,
        0,0,0,1,0,2,0,3,0,4,0,5,
        1,0,1,1,1,2,1,3,1,4,1,5,
        2,0,2,1
      ]
      index = 0
      for i in [0..9]
        for j in [0..5]
          result[index++].should.eql i
          result[index++].should.eql j


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
