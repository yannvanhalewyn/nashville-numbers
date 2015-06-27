var expect = require('chai').expect;
var ChordData = require('../src/chord-data');

describe('ChordData', function() {
  describe ('#init()', function() {
    context("when all params are provided", function() {
      it('stores all data provided', function() {
        var c = new ChordData("E", "m", "7", "9b5")
        expect(c.root).to.eql("E");
        expect(c.triad).to.eql("m");
        expect(c.seventh).to.eql("7");
        expect(c.extension).to.eql("9b5");
      });
    })

    context("when a param is left blank", function() {
      it('replaces stores that as an empty string', function() {
        var c = new ChordData()
        expect(c.root).to.eql("");
        expect(c.triad).to.eql("");
        expect(c.seventh).to.eql("");
        expect(c.extension).to.eql("");
      })
    })

    /*
     * context("when a param is not a string", function() {
     *   context("and it responds to toString()", function() {
     *     it('transforms that param into a string', function() {
     *       var c = new ChordData("E", "", 7, 9)
     *       expect(c.root).to.eql("E");
     *       expect(c.triad).to.eql("");
     *       expect(c.seventh).to.eql("7");
     *       expect(c.extension).to.eql("9");
     *     });
     *   });
     * });
     */
  });
});
