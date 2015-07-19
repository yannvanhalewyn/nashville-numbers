var include      = require('include')
  , chai         = require('chai')
  , sinonChai    = require('sinon-chai')
  , expect       = chai.expect
  , reqres       = require('reqres')
  , sinon        = require('sinon')
  , Factory      = include('/test/util/factory')
  , getTargetHub = include('/middlewares/getTargetHub')
  , Hub          = include('/models/hub')
  , Q            = require('q')
chai.use(sinonChai);

describe('MIDDLEWARE|getTargetHub', function() {

  var req, res, next;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    next = sinon.spy();
  });

  context("when existing hub_id has been given", function() {

    var USER, HUB;

    beforeEach(function() {
      return Factory('hub').then(function(entities) {
        HUB = entities.hub;
        req.params.hub_id = HUB._id.toString();
        sinon.stub(Hub, 'findById').returns(Q(HUB));
        return getTargetHub(req, res, next);
      });
    });

    afterEach(function() {
      Hub.findById.restore();
    });

    it("calls next", function() {
      expect(next).to.have.been.called;
    });

    it("calls Hub.findById with the correct ID", function() {
      expect(Hub.findById).to.have.been.calledWith(HUB._id.toString());
    });

    it("sets the req.target_hub property", function() {
      expect(req.target_hub).to.eql(HUB);
    });
  }); // End of context 'when existing user_id has been given'

  context("when no existing userID has been requested", function() {
    beforeEach(function() {
      req.params.hub_id = "999"; // invalid
      return getTargetHub(req, res, next);
    });

    it("redirects to hubs", function() {
      expect(res.redirect).to.have.been.calledWith('/hubs');
    });
  }); // End of context 'when no existing userID has been requested'

}); // End of describe 'MIDDLEWARE|getTargetUser'
