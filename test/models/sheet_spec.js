var include = require('include')
  , expect  = require('chai').expect
  , Sheet   = include('/models/sheet')
  , User    = include('/models/user')
  , Factory = include('/test/util/factory')
  , db      = include('/config/db')

describe('Sheet', function() {
  describe("instantiation", function() {
    var USER, VALID_PARAMS;
    beforeEach(function() {
      return Factory('user').then(function(user) {
        USER = user;
        VALID_PARAMS = {
          title: "theTitle",
          artist: "theArtist",
          data: {dummyData: true}
        };
      });
    });

    it("stores the information", function() {
      return Sheet.create(VALID_PARAMS, USER._id)
      .then(function(sheet) {
        expect(sheet._id).not.to.be.undefined;
        expect(sheet.properties.title).to.eql("theTitle");
        expect(sheet.properties.artist).to.eql("theArtist");
      });
    });

    it("stringifies the data as JSON", function() {
      return Sheet.create(VALID_PARAMS, USER._id).then(function(sheet) {
        var data = JSON.parse(sheet.properties.data);
        expect(data).to.eql({dummyData: true})
      });
    });

    it("creates a relationship to the user", function() {
      return Sheet.create(VALID_PARAMS, USER._id).then(function(sheet) {
        return db.query(
          "MATCH (p:Person)-[:AUTHORED]->(s:Sheet) WHERE id(s) = {sid} RETURN p",
          {sid: sheet._id}
        ).then(function(res) {
          expect(res[0].p._id).to.eql(USER._id);
        });
      });
    });

    context("with missing params", function() {
      it("sets the default title, artist and empty data object", function() {
        return Sheet.create({}, USER._id).then(function(sheet) {
          expect(sheet.properties.title).to.eql("title");
          expect(sheet.properties.artist).to.eql("artist");
          expect(sheet.properties.data).to.eql("{}");
        });
      });

      it("throws when author_id is missing", function() {
        expect(Sheet.create.bind(null, VALID_PARAMS)).to.throw("Cannot create a sheet without a valid author ID.");
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

    it("returns the new sheet properties", function() {
      return SHEET.update({title: "foo", artist: "bar"}).then(function(returned) {
        expect(returned._id).to.eql(SHEET._id);
        expect(returned.properties.title).to.eql("foo");
        expect(returned.properties.artist).to.eql("bar");
      });
    });

    it("keeps boolean attributes as boolean", function() {
      return SHEET.update({booleanAttribute: false}).then(function(sheet) {
        expect(sheet.properties.booleanAttribute).to.be.a("boolean");
      })
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

  describe('findByIdWithAuthor()', function() {
    context("when sheet exists", function() {
      var SHEET, AUTHOR, RESULT;
      beforeEach(function() {
        return Factory('sheet').then(function(entities) {
          SHEET = entities.sheet;
          AUTHOR = entities.user;
          return Sheet.findByIdWithAuthor(SHEET._id.toString()).then(function(result) {
            RESULT = result;
          });
        });
      });

      it("returns an object with the sheet instance as sheet", function() {
        expect(RESULT.sheet).to.be.an.instanceof(Sheet);
        expect(RESULT.sheet).to.eql(SHEET);
      });

      it("returns an object with the user instance as author", function() {
        expect(RESULT.author).to.be.an.instanceOf(User);
        expect(RESULT.author).to.eql(AUTHOR);
      });
    }); // End of context 'when sheet exists'

    context("when sheet doesn't exist", function() {
      var ERROR;
      beforeEach(function() {
        return Sheet.findByIdWithAuthor(999999).catch(function(error) {
          ERROR = error;
        });
      });

      it("throws a not found error", function() {
        expect(ERROR).to.eql("Could not find sheet with id " + 999999);
      });
    }); // End of context 'when sheet doesn't exist'
  }); // End of describe 'findByIdWithAuthor()'
}); // End of describe 'Shewhen sheet is not found
