var include   = require('include')
  , reqres    = require('reqres')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , db        = include('/config/db')
  , Sheet     = include('/models/sheet')
  , seed      = include('/test/util/seed_db')
  , login      = include('/test/util/login')
  , Router    = include('/routers/sheets')
chai.use(sinonChai);

// Clear DB
include('/test/util/clear_db');

describe('SHEETCONTROLLER', function() {

  var req, res;

  beforeEach(function() {
    res = reqres.res();
    req = reqres.req({
      isAuthenticated: function() { return false }
    });
  });


  /*
   * ========
   * GET#EDIT
   * ========
   */
  describe('GET#edit', function() {
    beforeEach(function() {
      return seed.bind(this)();
    });

    context("with correct logged in user", function() {
      beforeEach(function() {
        login(this.userA, req)
      });

      context("with valid sheetid", function() {
        beforeEach(function(done) {
          var id = this.sheets.userA[1]._id; // A1 has the data
          req.url = "/" + id + "/edit";
          Router(req, res);
          res.on('end', done);
        });

        it("renders the sheet template", function() {
          expect(res.render).to.have.been.calledWith("sheet");
        });

        it("sends along the correct sheet data", function() {
          var data = this.sheets.userA[1].properties.data;
          var dbid = this.sheets.userA[1]._id;
          expect(res.render).to.have.been.calledWith('sheet', {state: data, dbid: dbid});
        });
      });

      context("with missing or invalid sheetid", function() {
        beforeEach(function(done) {
          req.url = "/9999/edit"; // Missing sheet
          Router(req, res);
          res.on('end', done);
        });

        it("redirects to /sheets --", function() {
          expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
        });
      }); // End of context 'with missing or invalid sheetid'
    });

    // TODO Maybe redirect to the show page of the sheet if public, else
    // redirect to dashboard with a flash message
    context("when requesting user isn't the author", function() {
      beforeEach(function(done) {
        login(this.userB, req);
        var id = this.sheets.userA[0]._id;
        req.url = "/" + id + "/edit";
        Router(req, res);
        res.once('end', done);
      });

      it("redirects to /sheets a ", function() {
        expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
      });
    }); // End of context 'when requesting user isn't the author'
  }); // End of GET#show
});
