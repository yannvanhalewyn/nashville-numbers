var include   = require('include')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , router    = include('/routes/friends')
  , reqres    = require('reqres')

// Setup
chai.use(sinonChai);

// The tests
describe('GET /friends', function() {

  var req, res;

  context("when valid user is logged in", function() {
    beforeEach(function() {
      req = reqres.req({url: '/friends'});
      res = reqres.res();
      router(req, res);
    });

    it("renders the friends page", function(done) {
      res.on('end', function() {
        expect(res.render).to.have.been.calledWith('friends');
        done();
      });
    });
  }); // End of context 'when valid user is logged in'

  context("when no user logged in", function() {
    it("redirects to /home", function(done) {
    });
  }); // End of context 'when no user logged in'
}); // End of describe 'GET /friends'
