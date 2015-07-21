var include    = require('include')
  , sinon      = require('sinon')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Controller = include('/controllers/users/user_hub_invitations_controller')
  , Factory    = include('/test/util/factory')
  , Q          = require('q')
  , _          = require('lodash')
chai.use(sinonChai);

describe('UserHubInvitationsController', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('GET/index', function() {
    var USER;
    beforeEach(function(done) {
      return Factory('user').then(function(user) {
        sinon.stub(user, "getHubInvitations").returns(Q(dummyInvitations()));
        req.user = user;
        Controller.index(req, res);
        USER = user;
        res.on('end', done)
      });
    });

    it("calls getHubInvitations on the target_user", function() {
      expect(USER.getHubInvitations).to.have.been.called;
    });

    it("sends the results along as json", function() {
      expect(res.json).to.have.been.calledWith(dummyInvitations());
    });
  }); // End of describe 'GET/index'

  describe('DELETE/destroy', function() {
    var USER;
    beforeEach(function() {
      return Factory('user').then(function(user) {
        USER = user;
        req.user = user;
        req.params = {invitation_id: 123};
      });
    });

    context("when params state the invitation is accepted", function() {
      beforeEach(function() {
        req.body = {accept: true};
      });

      context("on successful invitation acceptation", function() {
        beforeEach(function(done) {
          sinon.stub(USER, 'acceptHubInvitation').returns(Q(dummyJoinedRelationship()));
          Controller.destroy(req, res);
          res.on('end', done)
        });

        it("calls acceptHubInvitation on the signed-in user with send in invitation_id", function() {
          expect(USER.acceptHubInvitation).to.have.been.calledWith(123);
        });

        it("returns the joined relationship as json", function() {
          expect(res.json).to.have.been.calledWith(dummyJoinedRelationship());
        });
      }); // End of context 'on successful invitation acceptation'

      context("on errors", function() {
        beforeEach(function(done) {
          USER.acceptHubInvitation = function() {
            var defered = Q.defer();
            defered.reject("SOME ERROR");
            return defered.promise;
          };
          Controller.destroy(req, res);
          res.on('end', done)
        });

        it("sends the error as string", function() {
          expect(res.send).to.have.been.calledWith("SOME ERROR");
        });
      }); // End of context 'on errors'
    }); // End of context 'when params state the invitation is accepted'
  }); // End of describe 'DELETE/destroy'
}); // End of describe 'USER_CONTROLLER'

function dummyInvitations() {
  return [
    {
      sender: {_id: 1},
      hub: {_id: 2},
      invitation: { _id: 3 }
    },
    {
      sender: {_id: 4},
      hub: {_id: 5},
      invitation: { _id: 6 }
    },
    {
      sender: {_id: 7},
      hub: {_id: 8},
      invitation: { _id: 9 }
    }
  ];
}

function dummyJoinedRelationship() {
  return {
    _id: 123,
    type: "JOINED",
    from_id: 111,
    to_id: 112
  }
}
