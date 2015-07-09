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
        expect(sheet._id).to.be.above(0);
        expect(sheet.properties.title).to.eql("theTitle");
        expect(sheet.properties.artist).to.eql("theArtist");
        expect(sheet.properties.visibility).to.eql("public");
      });
    });

    context("with missing params", function() {
      it("sets the default title, artist and visibility", function() {
        return new Sheet()
        .then(function(sheet) {
          expect(sheet.properties.title).to.eql("title");
          expect(sheet.properties.artist).to.eql("artist");
          expect(sheet.properties.visibility).to.eql("public");
        });
      });
    }); // End of context 'with missing params'
  }); // End of context 'instantiation'
}); // End of describe 'Sheet'
