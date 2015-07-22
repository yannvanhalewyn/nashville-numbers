var include          = require('include')
  , chai             = require('chai')
  , expect           = chai.expect
  , sinonChai        = require('sinon-chai')
  , sinon            = require('sinon')
  , reqres           = require('reqres')
  , Controller       = include('/controllers/hubs/hub_invitations_controller')
  , Factory          = include('/test/util/factory')
  , HubInvitation    = include('/models/hub_invitation')
  , rejectionPromise = include('/test/util/rejectionPromise')
  , Q                = require('q')
chai.use(sinonChai);

// Clear DB
include('/test/util/clear_db');

describe('HubInvitationsController', function() {
  var req, res, USER, HUB;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    return Factory('hub').then(function(entities) {
      USER = entities.user;
      HUB = entities.hub;
      req.params = {hub_id: HUB._id}
      req.user = USER;
    });
  });

  describe('GET/index', function() {
    var OTHER_USER, INVITATION;
    beforeEach(function(done) {
      return Factory('user').then(function(otherUser) {
        return USER.inviteToHub(HUB._id, otherUser._id).then(function(invitation) {
          OTHER_USER = otherUser;
          INVITATION = INVITATION;
          req.target_hub = HUB;
          sinon.stub(HUB, 'getInvitations').returns(Q(dummyInvitations()));
          Controller.index(req, res);
          res.on('end', done)
        });
      });
    });

    it("calls the targethub getInvitations", function() {
      expect(HUB.getInvitations).to.have.been.called;
    });

    it("sends the resulting invitations via json", function() {
      expect(res.json).to.have.been.calledWith(dummyInvitations());
    });
  }); // End of describe 'GET/index'

  describe('POST/create', function() {
    var OTHER_USER;
    var PERMISSIONS = 123;
    beforeEach(function(done) {
      return Factory('user').then(function(otherUser) {
        sinon.stub(USER, 'inviteToHub').returns(Q(dummyInvitation()));
        OTHER_USER = otherUser;
        req.body = {other_user_id: otherUser._id, permissions: PERMISSIONS};
        Controller.create(req, res);
        res.on('end', done)
      });
    });

    it("calls user#inviteToHub", function() {
      expect(USER.inviteToHub).to.have.been.calledWith(HUB._id, OTHER_USER._id, PERMISSIONS);
    });

    it("sends the created invitation as json", function() {
      expect(res.json).to.have.been.calledWith(dummyInvitation());
    });
  }); // End of describe 'POST/create'

  describe('PUT/update', function() {
    var INVITATION;
    beforeEach(function() {
      INVITATION = new HubInvitation();
      req.target_invitation = INVITATION;
    });

    context("with a body.permissions param", function(done) {
      var UPDATED_INVITATION;
      beforeEach(function(done) {
        UPDATED_INVITATION = new HubInvitation({permissions: 15});
        req.body = { permissions: 15 };
        sinon.stub(INVITATION, 'setPermissionValue').returns(Q(UPDATED_INVITATION));
        Controller.update(req, res);
        res.on('end', done)
      });

      it("calls setPermission", function() {
        expect(INVITATION.setPermissionValue).to.have.been.calledWith(15);
      });

      it("responds with the updated invitation via json", function() {
        expect(res.json).to.have.been.calledWith(UPDATED_INVITATION);
      });
    }); // End of context 'on success'

    context("without a body.permissions param", function() {
      beforeEach(function(done) {
        req.body = {};
        sinon.stub(INVITATION, 'setPermissionValue').returns(rejectionPromise("NO PERM"));
        Controller.update(req, res);
        res.on('end', done)
      });

      it("sends a 400 with the error body", function() {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith("NO PERM");
      });
    }); // End of context 'without a body.permissions param'
  }); // End of describe 'PUT/update'

  describe('DELETE/destroy', function() {
    context("with a valid hubInvitation", function() {
      beforeEach(function(done) {
        sinon.stub(USER, 'destroyHubInvitation').returns(Q());
        req.params = {invitation_id: 123};
        Controller.destroy(req, res);
        res.on('end', done);
      });

      it("calls destroyHubInvitation on user with the invitation_id", function() {
        expect(USER.destroyHubInvitation).to.have.been.calledWith(123);
      });

      it("returns a destroyed flag as json", function() {
        expect(res.json).to.have.been.calledWith({destroyed: true});
      });
    }); // End of context 'with a valid hubInvitation'

    context("On error", function() {
      beforeEach(function(done) {
        sinon.stub(USER, 'destroyHubInvitation').returns(rejectionPromise("THE ERROR"));
        req.params = {invitation_id: 123};
        Controller.destroy(req, res);
        res.on('end', done);
      });

      it("sends a 401 and the error message", function() {
        expect(res.status).to.have.been.calledWith(401);
        expect(res.send).to.have.been.calledWith("THE ERROR");
      });
    }); // End of context 'On error'
  }); // End of describe 'decription'
}); // End of describe 'HubInvitationsController'

function dummyInvitation() {
  return {
    invitation: { _id: 123, properties: {} }
  }
}

function dummyInvitations() {
  return [
    {
      invitation: { _id: 456, properties: {} },
      invitee: {_id: 897, properties: {}}
    },
    {
      invitation: { _id: 457, properties: {} },
      invitee: {_id: 898, properties: {}}
    },
    {
      invitation: { _id: 458, properties: {} },
      invitee: {_id: 899, properties: {}}
    }
  ];
}

function rejectionPromise() {
  var defered = Q.defer();
  defered.reject("SOME ERROR");
  return defered.promise;
}
