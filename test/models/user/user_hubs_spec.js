var include   = require('include')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , sinon     = require('sinon')
  , Q         = require('q')
  , Hub       = include('/models/hub')
  , Factory   = include('/test/util/factory')
  , db        = include('/config/db');
chai.use(sinonChai);

include('/test/util/clear_db');

describe('USER-HUBS methods', function() {

  var USER, HUB;

  beforeEach(function() {
    sinon.spy(Hub, 'create');
    return Factory('user').then(function(user) {
      return user.createHub("My Hub").then(function(hub) {
        USER = user;
        HUB = hub;
      });
    });
  });

  afterEach(function() {
    Hub.create.restore();
  });

  describe('user#createHub()', function() {
    it("calls create on Hub model with it's id", function() {
      expect(Hub.create).to.have.been.calledWith({creator_id: USER._id, name: "My Hub"});
    });

    it("returns a promise for that hub model", function() {
      expect(HUB).to.be.an.instanceof(Hub);
    });
  }); // End of describe 'user#createHub()'

  describe('user#inviteUserToHub()', function() {

    var OTHER_USER, HUB_INVITATION;

    beforeEach(function() {
      return Factory('user').then(function(otherUser) {
        return USER.inviteToHub(HUB._id, otherUser._id).then(function(invitation) {
          OTHER_USER = otherUser;
          HUB_INVITATION = invitation;
        });
      });
    });

    it("creates a HubInvitation node in the DB", function() {
      return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
        expect(result.length).to.eql(1);
      });
    });

    it("creates the :SENT :TO and :TO_JOIN relationships", function() {
      return db.query(
        "MATCH (u:Person)-[:SENT]->(hi:HubInvitation)-[:TO]->(p:Person), (hi)-[:TO_JOIN]-(h) " +
          "WHERE id(u) = {uid} AND id(p) = {pid} AND id(h) = {hid} RETURN hi",
        {uid: USER._id, pid: OTHER_USER._id, hid: HUB._id}
      ).then(function(result) {
        expect(result.length).to.eql(1);
      });
    });

    it("returns the invitation object", function() {
      expect(HUB_INVITATION).not.to.be.undefined;
      expect(HUB_INVITATION._id).not.to.be.undefined;
    });
  }); // End of describe 'user#inviteUserToHub()'

  describe('invalid invitations', function() {

    var USER_B, USER_C;

    beforeEach(function() {
      return Factory('user').then(function(userB) {
        return Factory('user').then(function(userC) {
          USER_B = userB;
          USER_C = userC;
        });
      });
    });

    context("when the creator tries to invite himself", function() {
      beforeEach(function() {
        return USER.inviteToHub(HUB._id, USER._id);
      });

      it("doesn't work (1)", function() {
        return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'when the creator tries to invite himself'

    context("When invitor didn't create the hub", function() {
      beforeEach(function() {
        return USER_B.inviteToHub(HUB._id, USER_C._id);
      });

      it("doesn't create an invitation (2)", function() {
        return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'When user didn't create the hub'

    context("when the user invites the creator of the hub", function() {
      beforeEach(function() {
        return USER_B.inviteToHub(HUB._id, USER._id);
      });

      it("doesn't create an invitation (3)", function() {
        return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'when the user invites the creator of the hub'

    context("when the user invites a user which is already in the hub", function() {
      beforeEach(function() {
        return USER.inviteToHub(HUB._id, USER_B._id).then(function() {
        //   // return USER.inviteToHub(HUB._id, USER_B._id);
        });
      });

      it("doesn't create an extra invitation (4)", function() {
        return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
          expect(result.length).to.eql(1);
        });
      });
    }); // End of context 'when the user invites a user which is already in the hub'
  }); // End of describe 'invalid invitations'
}); // End of describe 'USER-HUBS methods'
