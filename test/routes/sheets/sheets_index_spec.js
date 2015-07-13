var include   = require('include')
  , reqres    = require('reqres')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
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
   * =========
   * GET#INDEX
   * =========
   */
  describe('GET#index', function() {
    before(function() {
      return seed.bind(this)();
    });

    context("/users/me/sheets", function() {
      beforeEach(function() {
        req.params = { user_id: 'me' }
      });

      context("with a valid user logged in", function() {
        beforeEach(function(done) {
          login(this.userA, req);
          Router(req, res);
          res.on('end', done);
        });

        it("returns all the current user's sheets", function() {
          expect(res.render).to.have.been.calledWith('sheets');
        });

        it("sends along userA's sheets", function() {
          var sentSheets = res.render.firstCall.args[1].sheets;
          expect(sentSheets.length).to.eql(2);
          expect(sentSheets[0]._id).to.equal(this.sheets.userA[1]._id);
          expect(sentSheets[1]._id).to.equal(this.sheets.userA[0]._id);
        });
      }); // End of context 'with a valid user logged in'

      context("with no user logged in", function() {
        it("redirects to root", function(done) {
          Router(reqres.req(req), res);
          res.on('end', function() {
            expect(res.redirect).to.have.been.calledWith('/home');
            done();
          });
        });
      }); // End of context 'with no user logged in'
    }); // End of context '/users/me'
  }); // End of GET#index
});
