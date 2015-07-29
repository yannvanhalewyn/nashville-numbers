var include             = require('include')
  , chai                = require('chai')
  , sinonChai           = require('sinon-chai')
  , expect              = chai.expect
  , reqres              = require('reqres')
  , sinon               = require('sinon')
  , Q                   = require('q')
  , getTargetInvitation = include('/middlewares/hubs/getTargetInvitation')
  , HubInvitation       = include('/models/hub_invitation')
  , Factory             = include('/test/util/factory')
  , rejectionPromise    = include('/test/util/rejectionpromise')
chai.use(sinonChai);

describe('getTargetInvitation', function() {
  var req, res, next, USER;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    req.params = { invitation_id: 123 };
    return Factory('user').then(function(user) {
      USER = user;
      req.user = user;
    });
  });

  describe('sentByLoggedInUser', function() {
    context("on success", function() {
      beforeEach(function(done) {
        sinon.stub(HubInvitation, "findByIdAndSentBy").returns(Q({dummy: true}));
        next = sinon.spy(done);
        getTargetInvitation.sentByLoggedInUser(req, res, next);
      });

      afterEach(function() {
        HubInvitation.findByIdAndSentBy.restore();
      });

      it("calls next", function() {
        expect(next).to.have.been.called;
      });

      it("calls findByIdAndSentBy with the invitation_id param and logged in user's id", function() {
        expect(HubInvitation.findByIdAndSentBy).to.have.been.calledWith(123, USER._id);
      });

      it("stores the resulting data as req.target_invitation", function() {
        expect(req.target_invitation).to.eql({dummy: true});
      });
    }); // End of context 'on success'

    context("on errors", function() {
      beforeEach(function(done) {
        sinon.stub(HubInvitation, "findByIdAndSentBy").returns(rejectionPromise("SOME ERROR"));
        next = sinon.spy();
        getTargetInvitation.sentByLoggedInUser(req, res, next);
        res.on('end', done);
      });

      afterEach(function() {
        HubInvitation.findByIdAndSentBy.restore();
      });

      it("doesn't call next", function() {
        expect(next).not.to.have.been.called;
      });

      it("sends a 401 with the error message", function() {
        expect(res.status).to.have.been.calledWith(401);
        expect(res.send).to.have.been.calledWith("SOME ERROR");
      });
    }); // End of context 'on errors'
  }); // End of describe 'sentByLoggedInUser'

  describe('sentToLoggedInUser', function() {
    context("on success", function() {
      beforeEach(function(done) {
        sinon.stub(HubInvitation, "findByIdAndSentTo").returns(Q({dummy: true}));
        next = sinon.spy(done);
        getTargetInvitation.sentToLoggedInUser(req, res, next);
      });

      afterEach(function() {
        HubInvitation.findByIdAndSentTo.restore();
      });

      it("calls next", function() {
        expect(next).to.have.been.called;
      });

      it("calls findByIdAndSentTo with the invitation_id param and logged in user's id", function() {
        expect(HubInvitation.findByIdAndSentTo).to.have.been.calledWith(123, USER._id);
      });

      it("stores the resulting data as req.target_invitation", function() {
        expect(req.target_invitation).to.eql({dummy: true});
      });
    }); // End of context 'on success'

    context("on errors", function() {
      beforeEach(function(done) {
        sinon.stub(HubInvitation, "findByIdAndSentTo").returns(rejectionPromise("SOME NEW ERROR"));
        next = sinon.spy();
        getTargetInvitation.sentToLoggedInUser(req, res, next);
        res.on('end', done);
      });

      afterEach(function() {
        HubInvitation.findByIdAndSentTo.restore();
      });

      it("doesn't call next", function() {
        expect(next).not.to.have.been.called;
      });

      it("sends a 401 with the error message (2)", function() {
        expect(res.status).to.have.been.calledWith(401);
        expect(res.send).to.have.been.calledWith("SOME NEW ERROR");
      });
    }); // End of context 'on errors'
  }); // End of describe 'sentByLoggedInUser'
}); // End of describe 'getInvitationSentByUser'
