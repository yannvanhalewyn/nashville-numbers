var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , Controller = include('/controllers/friends_controller')
  , reqres     = require('reqres')
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
      Controller.index(req, res);
      res.on('end', done);
    });

    it("renders the friends page", function() {
      expect(res.render).to.have.been.calledWith('friends');
    });
  }); // End of describe 'GET#index'
}); // End of describe 'FRIENDSROUTES'
