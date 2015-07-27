var include = require('include')
  , expect  = require('chai').expect
  , Sheet   = include('/models/sheet')
  , Factory = include('/test/util/factory')
  , db = include('/config/db')

describe('Sheet', function() {
  describe("instantiation", function() {
    var USER, VALID_PARAMS;
    beforeEach(function() {
      return Factory('user').then(function(user) {
        USER = user;
        VALID_PARAMS = {
          title: "theTitle",
          artist: "theArtist",
          visibility: 'public',
          uid: user._id,
          data: "FOOBAR"
        };
      });
    });

    it("stores the information", function() {
      return Sheet.create(VALID_PARAMS)
      .then(function(sheet) {
        expect(sheet._id).to.be.above(0);
        expect(sheet.properties.title).to.eql("theTitle");
        expect(sheet.properties.artist).to.eql("theArtist");
        expect(sheet.properties.visibility).to.eql("public");
      });
    });

    it("stores JSON data with correct main values", function() {
      return Sheet.create(VALID_PARAMS).then(function(sheet) {
        var data = JSON.parse(sheet.properties.data);
        expect(data.main.title).to.eql("theTitle");
        expect(data.main.artist).to.eql("theArtist");
      });
    });

    it("stores a relationship to the user", function() {
      return Sheet.create(VALID_PARAMS).then(function(sheet) {
        return db.query(
          "MATCH (p:Person)-[:AUTHORED]->(s:Sheet) WHERE id(s) = {sid} RETURN p",
          {sid: sheet._id}
        ).then(function(res) {
          expect(res[0].p._id).to.eql(USER._id);
        });
      });
    });

    context("with missing params", function() {
      it("sets the default title, artist and visibility", function() {
        return Sheet.create({uid: USER._id})
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
    var SHEET;
    beforeEach(function() {
      return Factory('sheet').then(function(entities) {
        SHEET = entities.sheet;
      });
    });

    it("stores the updated data", function() {
      return SHEET.update({title: "updated-title", artist: "updated-artist"}).then(function() {
        return db.query("MATCH (s:Sheet) WHERE id(s) = {sid} RETURN s", {sid: SHEET._id})
        .then(function(updatedSheet) {
          expect(updatedSheet[0].s.properties.title).to.eql("updated-title");
          expect(updatedSheet[0].s.properties.artist).to.eql("updated-artist");
        });
      });
    });
  }); // End of describe '#update()'

  describe('#destroy()', function() {
    var SHEET;
    beforeEach(function() {
      return Factory('sheet').then(function(entities) {
        SHEET = entities.sheet;
        return SHEET.destroy();
      });
    });

    it("Has deleted the sheet from the database", function() {
      return db.query("MATCH (s:Sheet) WHERE id(s) = {sid} RETURN s", {sid: SHEET._id})
      .then(function(res) {
        expect(res.length).to.eql(0);
      });
    });
  }); // End of describe '#destroy()'

  describe('#author()', function() {
    var SHEET, USER;
    beforeEach(function() {
      return Factory('sheet').then(function(entities) {
        SHEET = entities.sheet;
        USER = entities.user;
      });
    });

    it("returns the correct author", function() {
      return SHEET.author().then(function(author) {
        expect(author).to.eql(USER);
      });
    });
  }); // End of describe '#author()'

  // STATIC
  describe('.findById()', function() {
    context("when valid id", function() {
      var CREATED_SHEET, FOUND_SHEET;
      beforeEach(function() {
        return Factory('sheet').then(function(entities) {
          CREATED_SHEET = entities.sheet;
          return Sheet.findById(CREATED_SHEET._id.toString()).then(function(foundSheet) {
            FOUND_SHEET = foundSheet;
          });
        });
      });

      it("returns an instance of Sheet", function() {
        expect(FOUND_SHEET).not.to.be.undefined;
        expect(FOUND_SHEET).to.be.an.instanceof(Sheet);
      });

      it("returns the searched for sheet", function() {
        expect(FOUND_SHEET).to.eql(CREATED_SHEET);
      });
    }); // End of context 'when found'

    context("when not found", function() {
      it("throws a not found error", function(done) {
        return Sheet.findById(9999).then(done, function(err) {
          expect(err).to.eql("Could not find sheet with id 9999");
          done();
        }).catch(done);
      });
    }); // End of context 'when not found'
  }); // End of describe '.findById()'
}); // End of describe 'Shewhen sheet is not found
