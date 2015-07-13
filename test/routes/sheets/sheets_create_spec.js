var include   = require('include')
  , reqres    = require('reqres')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , db        = include('/config/db')
  , Sheet     = include('/models/sheet')
  , Factory = include('/test/util/factory')
  , Router = include('/routers/sheets')
chai.use(sinonChai);

// Clear DB
include('/test/util/clear_db');

describe('SHEETCONTROLLER', function() {

  var req, res;

  beforeEach(function() {
    req = {isAuthenticated: function() {return false} };
    res = reqres.res();
  });

  /*
   * ===========
   * POST#CREATE
   * ===========
   */
  describe('POST#create', function() {
    beforeEach(function() {
      req.url = '/';
      req.method = 'POST';
      req.body = {title: "The title", artist: "The artist", visibility: "public"};
    });

    context("with a valid user logged in", function() {
      beforeEach(function(done) {
        return Factory('user').then(function(user) {
          login(user, req);
          Router(reqres.req(req), res);
          res.once('end', done);
        });
      });

      it('creates a new sheet in the database', function() {
        return db.query(
          "MATCH (s:Sheet {title: {title}}) RETURN s", {title: "The title"}
        ).then(function(response) {
          expect(response.length).to.eql(1);
        })
      });

      it("stores the title, artist and authorID", function() {
        return db.query(
          "MATCH (s:Sheet {title: {title}}) RETURN s", {title: "The title"}
        ).then(function(response) {
          var sheet = response[0].s;
          expect(sheet.properties.title).to.eql("The title");
          expect(sheet.properties.artist).to.eql("The artist");
          expect(sheet.properties.visibility).to.eql("public");
        });
      });

      it("redirects to the newly created sheet's edit page", function() {
        return db.query(
          "MATCH (s:Sheet {title: {title}}) RETURN s", {title: "The title"}
        ).then(function(response) {
          var url = "/users/me/sheets/" + response[0].s._id + "/edit";
          expect(res.redirect).to.have.been.calledWith(url);
        })
      });
    }); // END of with valid logged in user

    context("when not logged in", function() {
      it("redirects to /home", function(done) {
        Router(reqres.req(req), res);
        res.once('end', function() {
          expect(res.redirect).to.have.been.calledWith('/home');
          done();
        });
      });
    });
  }); // END of POST#create
});


/*
 * ===============
 * PRIVATE HELPERS
 * ===============
 */
// Modifies the res object to pass passport authentication
function login(user, req) {
  req.isAuthenticated = function() {
    return true;
  }
  req.user = user;
}
