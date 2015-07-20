var include    = require('include')
  , chai       = require('chai')
  , expect     = chai.expect
  , sinonChai = require('sinon-chai')
  , sinon      = require('sinon')
  , reqres     = require('reqres')
  , Controller = include('/controllers/hubs/hub_invitations_controller')
  , Factory    = include('/test/util/factory')
  , Q          = require('q')
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
    beforeEach(function(done) {
      return Factory('user').then(function(otherUser) {
        sinon.stub(USER, 'inviteToHub').returns(Q(dummyInvitation()));
        OTHER_USER = otherUser;
        req.body = {other_user_id: otherUser._id}
        Controller.create(req, res);
        res.on('end', done)
      });
    });

    it("calls user#inviteToHub", function() {
      expect(USER.inviteToHub).to.have.been.calledWith(HUB._id, OTHER_USER._id);
    });

    it("sends the created invitation as json", function() {
      expect(res.json).to.have.been.calledWith(dummyInvitation());
    });
  }); // End of describe 'POST/create'
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

