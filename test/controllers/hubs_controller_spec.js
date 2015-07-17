var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Controller = include('/controllers/hubs_controller')
  , Factory    = include('/test/util/factory')
  , Q          = require('q')
  , sinon      = require('sinon')
chai.use(sinonChai);

describe('HUBS_CONTROLLER', function() {

  var req, res, USER;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    return Factory('user').then(function(user) {
      USER = user;
    });
  });

  describe('POST/create', function() {
    beforeEach(function(done) {
      sinon.stub(USER, 'createHub').returns(Q(dummyHub()));
      req.body = {name: "The Hubs Name"};
      req.user = USER;
      Controller.create(req, res);
      res.on('end', done);
    });

    it("calls user.createHub with the sent in hub name", function() {
      expect(USER.createHub).to.have.been.calledWith("The Hubs Name");
    });

    it("redirects to the newly created hub", function() {
      expect(res.redirect).to.have.been.calledWith("/hubs/" + dummyHub()._id);
    });
  }); // End of describe 'POST/create'
}); // End of describe 'HUBS_CONTROLLER'

function dummyHub() {
  return {
    _id: 123,
    properties: {
      name: "The Hubs Name"
    }
  }
}
