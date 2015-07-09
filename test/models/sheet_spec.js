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

  describe("instantiation", function() {
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
        return Sheet.create({uid: this.user._id})
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
  }); // End of describe 'instantiation'

  describe("#update()", function() {
    it("stores the updated data", function() {
      return Sheet.create(this.params).then(function(sheet) {
        return sheet.update({title: "updated-title", artist: "updated-artist"}).then(function() {
          return db.query("MATCH (s:Sheet) WHERE id(s) = {sid} RETURN s", {sid: sheet._id})
          .then(function(updatedSheet) {
            expect(updatedSheet[0].s.properties.title).to.eql("updated-title");
            expect(updatedSheet[0].s.properties.artist).to.eql("updated-artist");
          });
        });
      });
    });
  }); // End of describe '#update()'

  describe('#destroy()', function() {
    beforeEach(function() {
      return Sheet.create(this.params).then(function(sheet) {
        this.sheet = sheet;
        return sheet.destroy()
      }.bind(this));
    });

    it("Has deleted the sheet from the database", function() {
      return db.query("MATCH (s:Sheet) WHERE id(s) = {sid} RETURN s", {sid: this.sheet._id})
      .then(function(res) {
        expect(res.length).to.eql(0);
      }.bind(this));
    });
  }); // End of describe '#destroy()'
}); // End of describe 'Sheet'
