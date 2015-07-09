var include = require('include');
var expect  = require('chai').expect;
var Sheet   = include('/models/sheet');

describe('Sheet', function() {
  beforeEach(function() {
    this.params = {
      title: "theTitle",
      artist: "theArtist",
      visibility: 'public'
    }
  });
  context("instantiation", function() {
    it("stores the information", function() {
      return new Sheet(this.params)
      .then(function(sheet) {
        expect(sheet.id).to.be.above(0);
        expect(sheet.title).to.eql("theTitle");
        expect(sheet.artist).to.eql("theArtist");
        expect(sheet.visibility).to.eql("public");
      })
    });

    context("with missing params", function() {
      it("sets the default title, artist and visibility", function() {
        return new Sheet()
        .then(function(sheet) {
          expect(sheet.title).to.eql("title");
          expect(sheet.artist).to.eql("artist");
          expect(sheet.visibility).to.eql("public");
        })
      });
    }); // End of context 'with missing params'
  }); // End of context 'instantiation'
}); // End of describe 'Sheet'
