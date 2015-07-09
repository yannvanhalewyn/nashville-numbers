var include = require('include')
  , expect  = require('chai').expect
  , Sheet   = include('/models/sheet')
  , Factory = include('/test/util/factory')
  , db = include('/config/db')

describe('Sheet', function() {
  beforeEach(function(done) {
    Factory('user').then(function(user) {
      this.user = user;
      this.params = {
        title: "theTitle",
        artist: "theArtist",
        visibility: 'public',
        uid: user._id
      };
      done();
    }.bind(this))
  });

  context("instantiation", function() {
    it("stores the information", function() {
      return Sheet.create(this.params)
      .then(function(sheet) {
        expect(sheet._id).to.be.above(0);
        expect(sheet.properties.title).to.eql("theTitle");
        expect(sheet.properties.artist).to.eql("theArtist");
        expect(sheet.properties.visibility).to.eql("public");
      });
    });

    it("stores a relationship to the user", function() {
      return Sheet.create(this.params).then(function(sheet) {
        return db.query(
          "MATCH (p:Person)-[:AUTHORED]->(s:Sheet) WHERE id(s) = {sid} RETURN p",
          {sid: sheet._id}
        ).then(function(res) {
          expect(res[0].p._id).to.eql(this.user._id);
        }.bind(this));
      }.bind(this));
    });

    context("with missing params", function() {
      it("sets the default title, artist and visibility", function() {
        return Sheet.create({uid: 111})
        .then(function(sheet) {
          expect(sheet.properties.title).to.eql("title");
          expect(sheet.properties.artist).to.eql("artist");
          expect(sheet.properties.visibility).to.eql("public");
        });
      });

      it("throws when uid is missing", function(done) {
        return Sheet.create().then(done, function(err) {
          done(); // This done will pass, if the first on is called it will throw because params
        });
      });
    }); // End of context 'with missing params'
  }); // End of context 'instantiation'
}); // End of describe 'Sheet'
