var include    = require('include')
  , sinon      = require('sinon')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Q          = require('q')
  , middleware = include('/middlewares/getTargetHubWithRelationship')
  , Factory    = include('/test/util/factory')
  , rejectionPromise = include('/test/util/rejectionPromise');
chai.use(sinonChai);

describe('getTargetHubWithRelationship', function() {
  var req, res, USER;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    req.params = {hub_id: 123}
    return Factory('user').then(function(user) {
      USER = user;
      req.user = user;
    });
  });

  context("when user.getRelationshipToHub returns successfuly", function() {
    var next;
    beforeEach(function(done) {
      next = sinon.spy(done);
      var dummy = {hub: {dummy: 'hub'}, relationship: {dummy: 'relationship'}};
      sinon.stub(USER, 'getRelationshipToHub').returns(Q(dummy));
      middleware(req, res, next);
    });

    it("calls next", function() {
      expect(next).to.have.been.called;
    });

    it("calls getRelationshipToHub with req.hub_id", function() {
      expect(USER.getRelationshipToHub).to.have.been.calledWith(123);
    });

    it("stores the returned hub as req.target_hub", function() {
      expect(req.target_hub).to.eql({dummy: "hub"});
    });

    it("stores the returned relationship as req.relationshipToTargetHub", function() {
      expect(req.relationshipToTargetHub).to.eql({dummy: "relationship"});
    });
  }); // End of context 'when user.getRelationshipToHub returns successfuly'

  context("when user.getRelationshipToHub throws an error", function() {
    var next;
    beforeEach(function(done) {
      next = sinon.spy();
      sinon.stub(USER, 'getRelationshipToHub').returns(rejectionPromise("NOT ALLOWED"));
      middleware(req, res, next);
      res.on('end', done);
    });

    it("sends a 400 with the error message", function() {
      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith("NOT ALLOWED");
    });

    it("doesn't call next", function() {
      expect(next).not.to.have.been.called;
    });
  }); // End of context 'when user.getRelationshipToHub throws an error'
}); // End of describe 'getTargetHubWithR'
