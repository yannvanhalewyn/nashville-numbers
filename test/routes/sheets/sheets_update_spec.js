var include   = require('include')
  , reqres    = require('reqres')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , Sheet     = include('/models/sheet')
  , Factory   = include('/test/util/factory')
  , login     = include('/test/util/login')
  , Router    = include('/routers/sheets')
chai.use(sinonChai);

// Clear DB
include('/test/util/clear_db');

describe('SHEETCONTROLLER', function() {

  var req, res;

  beforeEach(function() {
    req = reqres.req({
      isAuthenticated: function() {  return false;  },
      method: 'PUT'
    });
    res = reqres.res();
  });

  /*
   * ==========
   * PUT#update
   * ==========
   */
  describe('PUT#update', function() {
    beforeEach(function() {
      return Factory('sheet').then(function(entities) {
        this.user = entities.user;
        this.sheet = entities.sheet;
      }.bind(this));
    });

    context("with correct user logged in", function() {
      beforeEach(function() {
        login(this.user, req);
      });

      context("with valid sheetID", function() {
        beforeEach(function(done) {
          req.url = "/" + this.sheet._id;
          req.body = dummyUpdateData();
          Router(req, res);
          res.on('end', done);
        });

        it("responds with a 200", function() {
          expect(res.sendStatus).to.have.been.calledWith(200);
        });

        it("updates the sheet.data in the DB", function() {
          return Sheet.findById(this.sheet._id).then(function(sheet) {
            expect(sheet.properties.data).to.eql(JSON.stringify(dummyUpdateData()));
          });
        });

        it("updates the sheets title and artist in the DB", function() {
          return Sheet.findById(this.sheet._id).then(function(sheet) {
            expect(sheet.properties.title).to.eql("newTitle");
            expect(sheet.properties.artist).to.eql("newArtist");
          });
        });
      }); // End of context 'with valid sheetID'

      context("with invalid sheet id", function() {
        beforeEach(function(done) {
          req.url = "/" + "invalid";
          Router(req, res);
          res.on('end', done)
        });

        it("sends a 404 with a custom message", function() {
          expect(res.status).to.have.been.calledWith(404);
          expect(res.send).to.have.been.calledWith("Could not find sheet with id invalid");
        });
      }); // End of context 'with invalid sheet id'
    }); // End of context 'with valid user logged in'

    context("with no user logged in", function() {
      beforeEach(function(done) {
        req.url = "/" + this.sheet._id;
        Router(req, res);
        res.on('end', done);
      });

      it("redirects to /home (01)", function() {
        expect(res.redirect).to.have.been.calledWith("/home");
      });
    }); // End of context 'with no user logged in'

    context("when logged in user isn't the author of the sheet", function() {
      beforeEach(function(done) {
        // Create another user, then fire off request to update 1st sheet
        Factory('user').then(function(userB) {
          req.url = "/" + this.sheet._id;
          login(userB, req);
          Router(req, res);
          res.on('end', done)
        }.bind(this));
      });

      it("sends a 403", function() {
        expect(res.status).to.have.been.calledWith(403);
        expect(res.send).to.have.been.calledWith("You're not the author of this sheet.");
      });
    }); // End of context 'when logged in user isn't the author of the sheet'
  }); // End of describe 'PUT#update'
});


/*
 * ===============
 * PRIVATE HELPERS
 * ===============
 */
function dummyUpdateData() {
  return {
    main: {
      title: "newTitle", artist: "newArtist",
      sections: ["section1", "section2", "section3"]
    },
    sections: { section1: {foo: "bar"} }
  }
}
