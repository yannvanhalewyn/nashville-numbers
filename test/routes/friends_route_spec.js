var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , Controller = include('/controllers/friends_controller')
  , reqres     = require('reqres')
  , login      = include('/test/util/login')
  , Factory    = include('/test/util/factory')
chai.use(sinonChai);

// Setup
include('/test/util/clear_db')

describe('FRIENDSROUTES', function() {

  var req, res;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  // INDEX
  describe('GET#index', function() {
    beforeEach(function(done) {
      req.url = "/friends";
      // return Factory('user').then(function(user) {
        // login(user, req);
        res.on('end', done);
        Controller.index(req, res);
      // });
    });

    it("renders the friends page", function() {
      expect(res.render).to.have.been.calledWith('friends');
    });

    it("returns the logged in user's friendslist", function(done) {
    });
  }); // End of describe 'GET#index'
}); // End of describe 'FRIENDSROUTES'
