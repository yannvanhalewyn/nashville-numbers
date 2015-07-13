var include   = require('include')
  , reqres    = require('reqres')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , Router    = include('/routers/sheets')
  , Factory   = include('/test/util/factory')
  , login     = include('test/util/login')
  , db        = include('/config/db')
chai.use(sinonChai);

// Clear DB
include('/test/util/clear_db');

describe('SHEETCONTROLLER', function() {

  var req, res;

  beforeEach(function() {
    req = reqres.req({
      isAuthenticated: function() {return false},
      method: "DELETE"
    });
    res = reqres.res();
    return Factory('sheet').then(function(entities) {
      this.user  = entities.user;
      this.sheet = entities.sheet;
    }.bind(this))
  });

  /*
   * =============
   * DELET#destroy
   * =============
   */
  describe('DELETE#destroy', function() {
    context("when author is logged in", function() {
      beforeEach(function() {
        login(this.user, req);
      });

      context("and valid sheetID is given", function() {
        beforeEach(function(done) {
          req.url = '/' + this.sheet._id;
          Router(req, res);
          res.on('end', done);
        });

        it("deletes the sheet document", function() {
          return db.query("MATCH (s:Sheet) WHERE id(s) = {sid} RETURN s", {sid: this.sheet._id})
          .then(function(result) {
            expect(result.length).to.eql(0);
          });
        });

        context("when the request wants HTML", function() {
          it("redirects to /sheets", function() {
            expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
          });
        }); // End of context 'when the request wants HTML'

        context.skip("when the request wants JSON", function() {
          it("sends a 200 OK with the updated users sheet list", function() {
          });
        }); // End of context 'when the request wants JSON'
      }); // End of context 'and valid sheetID is given'

      context("when an invalid/missing sheetID is given", function() {
        beforeEach(function(done) {
          req.url = "/9999"; // Invalid ID
          Router(req, res);
          res.on('end', done)
        });

        it("sends a 404 (3)", function() {
          expect(res.sendStatus).to.have.been.calledWith(404);
        });
      }); // End of context 'when an invalid/missing sheetID is given'
    }); // End of context 'when correct user is logged in'

    // NOTE Should I test if the document doesn't get deleted every time?
    context("when logged in user isn't the author", function() {
      beforeEach(function(done) {
        Factory('user').then(function(userB) {
          login(userB, req);
          req.url = "/" + this.sheet._id;
          Router(req, res);
          res.on('end', done)
        }.bind(this));
      });

      it("sends a 403", function() {
        expect(res.status).to.have.been.calledWith(403);
        expect(res.send).to.have.been.calledWith("You're not the author of this sheet");
      });

      it("doesn't delete the document from the db", function() {
        return db.query("MATCH (s:Sheet) WHERE id(s) = {sid} RETURN s", {sid: this.sheet._id})
        .then(function(result) {
          expect(result.length).to.eql(1);
        });
      });
    }); // End of context 'when logged in user isn't the author'
  }); // End of describe 'DELETE#destroy'
});
