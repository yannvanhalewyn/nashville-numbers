var expect = require('chai').expect;
var Factory = require('../src/chord-data-factory');
var ChordData = require('../src/chord-data');

describe('ChordDataFactory', function() {
  describe('#fromRawString()', function() {
    it('returns a ChordData object', function() {
      expect(Factory.fromRawString("")).to.be.instanceOf(ChordData);
    });

    describe('interpreting', function() {
      context('when no match', function() {
        it('returns an empty chordData object', function() {
          var data = Factory.fromRawString("ppp");
          expect(data).to.eql({root: "", triad: "", seventh: "", extension: ""});
        });
      });

      describe('root notes', function() {
        it('understands a single root note - letter', function() {
          var data = Factory.fromRawString("e");
          expect(data.root).to.equal("e");
        });

        it('understands a single root note - number', function() {
          var data = Factory.fromRawString("7");
          expect(data.root).to.equal("7");
        });

        it('ignores any letters past g', function() {
          var data = Factory.fromRawString("h");
          expect(data.root).to.equal("");
        });

        it('ignores any numbers past 7', function() {
          var data = Factory.fromRawString("8");
          expect(data.root).to.equal("");
        });

        it('understands a flat after the root', function() {
          var data = Factory.fromRawString("Ab");
          expect(data.root).to.equal("Ab");
        });

        it('understands a sharp after the root', function() {
          var data = Factory.fromRawString("A#");
          expect(data.root).to.equal("A#");
        });

        it('understands a flat before the root', function() {
          var data = Factory.fromRawString("b5");
          expect(data.root).to.equal("b5");
        });

        it('understands a sharp before the root', function() {
          var data = Factory.fromRawString("#4");
          expect(data.root).to.equal("#4");
        });
      });

      describe('triads', function() {
        it("understands a 'm' after a root note", function() {
          var data = Factory.fromRawString("am");
          expect(data.triad).to.equal("m");
        });

        it("understands a 'min' after a root note", function() {
          var data = Factory.fromRawString("7min");
          expect(data.triad).to.equal("min");
        });

        it("understands a '-' after a root note", function() {
          var data = Factory.fromRawString("B-");
          expect(data.triad).to.equal("-");
        });
      });

      describe('sevenths', function() {
        it("understands dominant 7", function() {
          var data = Factory.fromRawString("B-7");
          expect(data.seventh).to.equal("7");
        });

        it("understands maj", function() {
          var data = Factory.fromRawString("cmaj");
          expect(data.seventh).to.equal("maj");
        });

        it("understands maj after a -", function() {
          var data = Factory.fromRawString("c-maj");
          expect(data.seventh).to.equal("maj");
        });

        it("understands caret", function() {
          var data = Factory.fromRawString("C^");
          expect(data.seventh).to.equal("^");
        });
      });
    });
  });
});
