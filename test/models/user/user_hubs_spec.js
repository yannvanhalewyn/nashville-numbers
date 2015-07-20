var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , chaiThings = require('chai-things')
  , expect     = chai.expect
  , sinon      = require('sinon')
  , Q          = require('q')
  , Hub        = include('/models/hub')
  , Factory    = include('/test/util/factory')
  , db         = include('/config/db')
  , _          = require('lodash')
chai.use(sinonChai);
chai.use(chaiThings);

include('/test/util/clear_db');

describe('USER-HUBS methods', function() {

  var USER;

  beforeEach(function() {
    return Factory('user').then(function(user) {
      USER = user;
    });
  });

/*
 * =========
 * getHubs()
 * =========
 */
  describe('user#getHubs()', function() {

    var CREATED_HUB_A, CREATED_HUB_B;

    beforeEach(function() {
      return Factory('hub', {creator_id: USER._id}).then(function(hub1) {
        return Factory('hub', {creator_id: USER._id}).then(function(hub2) {
          return db.query(
            "MATCH (u:Person) WHERE id(u)={uid} CREATE (u)-[:JOINED]->(h:Hub) " +
            "RETURN h", {uid: USER._id}
          ).then(function(results) {
            CREATED_HUB_A = hub1;
            CREATED_HUB_B = hub2;
            JOINED_HUB = results[0].h;
          })
        });
      });
    });

    it("returns all the hubs created by user", function() {
      return USER.getHubs().then(function(hubs) {
        expect(hubs.length).to.eql(3);
        var ids = _.map(hubs, function(entry) { return entry.hub._id; });
        expect(ids).to.include(CREATED_HUB_A._id);
        expect(ids).to.include(CREATED_HUB_B._id);
        expect(ids).to.include(JOINED_HUB._id);
      });
    });
  }); // End of describe 'user#getHubs()'

/*
 * ===========
 * createHub()
 * ===========
 */
  describe('user#createHub()', function() {

    var HUB;

    beforeEach(function() {
      sinon.spy(Hub, 'create');
      return USER.createHub("My Hub").then(function(hub) {
        HUB = hub;
      });
    });

    afterEach(function() {
      Hub.create.restore();
    });

    it("calls create on Hub model with it's id", function() {
      expect(Hub.create).to.have.been.calledWith({creator_id: USER._id, name: "My Hub"});
    });

    it("returns a promise for that hub model", function() {
      expect(HUB).to.be.an.instanceof(Hub);
    });
  }); // End of describe 'user#createHub()'

/*
 * ===============
 * inviteUserToHub
 * ===============
 */
  describe('user#inviteUserToHub()', function() {

    var HUB, USER_B

    beforeEach(function() {
      return Factory('hub', {creator_id: USER._id}).then(function(hub) {
        return Factory('user').then(function(otherUser) {
          HUB = hub;
          USER_B = otherUser;
        });
      });
    });

    describe('valid invitations', function() {

      var HUB_INVITATION;

      beforeEach(function() {
        return USER.inviteToHub(HUB._id.toString(), USER_B._id.toString()).then(function(invitation) {
          HUB_INVITATION = invitation;
        });
      });

      it("creates a HubInvitation node in the DB", function() {
        return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
          expect(result.length).to.eql(1);
        });
      });

      it("creates the :SENT :TO and :TO_JOIN relationships", function() {
        return db.query(
          "MATCH (u:Person)-[:SENT]->(hi:HubInvitation)-[:TO]->(p:Person), " +
          "(hi)-[:TO_JOIN]-(h) " +
          "WHERE id(u) = {uid} AND id(p) = {pid} AND id(h) = {hid} RETURN hi",
          {uid: USER._id, pid: USER_B._id, hid: HUB._id}
        ).then(function(result) {
          expect(result.length).to.eql(1);
        });
      });

      it("returns the an object containing the invitation and the invitee", function() {
        expect(HUB_INVITATION.invitation).not.to.be.undefined;
        expect(HUB_INVITATION.invitee).not.to.be.undefined;
        expect(HUB_INVITATION.invitee._id).to.eql(USER_B._id)
      });
    }); // End of describe 'valid invitations'


    describe('invalid invitations', function() {
      var USER_C;
      beforeEach(function() {
        return Factory('user').then(function(userC) {
          USER_C = userC;
        });
      });

      context("when userA already invited userB to join another hub", function() {
        var HUB_B, INVITATION_A;
        beforeEach(function() {
          return USER.createHub('hub b').then(function(hub) {
            return USER.inviteToHub(hub._id, USER_B._id).then(function(invitation) {
              INVITATION_A = invitation;
            });
          });
        });

        it("creates a second invitation", function() {
          return USER.inviteToHub(HUB._id, USER_B._id).then(function(invitation) {
            expect(invitation).not.to.be.empty;
            expect(invitation.invitation._id).not.to.eql(INVITATION_A._id);
          });
        });
      }); // End of context 'when an invitation already exists to another user'

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
            return USER.inviteToHub(HUB._id, USER_B._id);
          });
        });

        it("doesn't create an extra invitation (4)", function() {
          return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
            expect(result.length).to.eql(1);
          });
        });
      }); // End of context 'when the user invites a user which is already in the hub'
    }); // End of describe 'invalid invitations'
  }); // End of describe 'user#inviteUserToHub()'

  describe('getHubInvitations', function() {
    var HUB, USER_B;
    beforeEach(function() {
      return Factory('hub', {creator_id: USER._id}).then(function(hub) {
        return Factory('user').then(function(otherUser) {
          HUB = hub;
          USER_B = otherUser;
        });
      });
    });

    context("when user has invitations to hubs", function() {
      var INVITATION, RESULT;
      beforeEach(function() {
        return USER.inviteToHub(HUB._id, USER_B._id).then(function(hubInvitation) {
          return USER_B.getHubInvitations().then(function(result) {
            INVITATION = hubInvitation.invitation;
            RESULT = result;
          });
        });
      });

      it("returns an array", function() {
        expect(RESULT.length).to.eql(1);
      });

      it("returns an object containing the invitation", function() {
        expect(RESULT[0].invitation).to.eql(INVITATION);
      });

      it("returns an object containing the targetHub", function() {
        expect(RESULT[0].sender._id).to.eql(USER._id);
      });

      it("returns an object containing the sender", function() {
        expect(RESULT[0].hub._id).to.eql(HUB._id);
      });
    }); // End of context 'when user has invitations to hubs'

    context("When user has no open invitations", function() {
      it("returns an empty array", function() {
        return USER.getHubInvitations().then(function(result) {
          expect(result).to.eql([]);
        });
      });
    }); // End of context 'When user has no open invitations'
  }); // End of describe 'getHubInvitations'
}); // End of describe 'USER-HUBS methods'
