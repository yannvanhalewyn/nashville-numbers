var include          = require('include')
  , reqres           = require('reqres')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , sinon            = require('sinon')
  , middleware       = include('/middlewares/hubs/ensureCreated')
chai.use(sinonChai);

describe('MIDDLEWARE|ensureCreated', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  context("when hub was created by user", function() {
    it("calls next once --", function() {
      req.target_hub_relationship_to_user = {type: "CREATED"}
      var next = sinon.spy();
      middleware(req, res, next);
      expect(next).to.have.been.calledOnce;
    });
  }); // End of context 'when targetSheet is public'

  context("when hub was not created by user", function() {
    it("calls next once with an error message", function() {
      req.target_hub_relationship_to_user = {type: "JOINED"}
      next = sinon.spy();
      middleware(req, res, next);
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith("You are not the creator of this hub.");
    });
  }); // End of context 'when targetSheet is private'
}); // End of describe 'ensureAuthoredOrPublic'
