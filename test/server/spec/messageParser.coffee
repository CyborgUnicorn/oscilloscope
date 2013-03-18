chai = require 'chai'
chai.should()

MessageParser = require('../../../lib/messageParser').MessageParser

describe 'MessageParser', ->

  beforeEach ->
    @parser = new MessageParser
    this
    @data = [
      120, 121, 122, 123, 124, 125, 126, 127, 0, 215, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119 ]

  describe '#reorganize', ->

    it 'puts the first 8 values at the back', ->
      result = @parser.reorganize [1..10]
      result.should.eql [9, 10, 1, 2, 3, 4, 5, 6, 7, 8]

      result = @parser.reorganize @data
      result.slice(0, 8).should.eql [0, 215, 2, 3, 4, 5, 6, 7]

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
      firstVal.should.eql 2569
