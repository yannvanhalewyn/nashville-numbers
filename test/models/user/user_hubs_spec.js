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

  describe('acceptHubInvitation', function() {
    context("when the invitation exists", function() {
      var USER_B, HUB, INVITATION;
      beforeEach(function() {
        return Factory('hub').then(function(entities) {
          USER_B = entities.user;
          HUB = entities.hub;
          return USER_B.inviteToHub(HUB._id, USER._id).then(function(invitation) {
            INVITATION = invitation.invitation;
          });
        });
      });

      context("when the user is the invitee", function() {
        var RETURNED;
        beforeEach(function() {
          return USER.acceptHubInvitation(INVITATION._id.toString()).then(function(relationship) {
            RETURNED = relationship;
          });
        });

        it("destroys the invitation object", function() {
          return db.query("MATCH (invitation:HubInvitation) RETURN invitation")
          .then(function(result) {
            expect(result.length).to.eql(0);
          });
        });

        it("creates a JOINED relationship to the hub", function() {
          return db.query(
            "MATCH (u:Person)-[r:JOINED]->(h:Hub) WHERE id(h) = {hid} RETURN r",
            {hid: HUB._id}
          ).then(function(result) {
            expect(result.length).to.eql(1);
          });
        });

        it("returns the JOINED relationship", function() {
          return db.query(
            "MATCH (u:Person)-[r:JOINED]->(h:Hub) WHERE id(h) = {hid} RETURN r",
            {hid: HUB._id}
          ).then(function(result) {
            expect(RETURNED._id).not.to.be.undefined;
            expect(RETURNED._id).to.eql(result[0].r._id);
          });
        });
      }); // End of context 'when the user is the invitee'

      context("when the invitor accepts the invitation", function() {
        var RETURNED, ERROR;
        beforeEach(function() {
          return USER_B.acceptHubInvitation(INVITATION._id).then(function(result) {
            RETURNED = result;
          }, function(error) {
            ERROR = error;
          });
        });

        it("throws a notAllowed error (1)", function() {
          expect(ERROR).to.eql("Cannot accept someone else's hub invitation.");
        });

        it("doesn't destroy the hub invitation", function() {
          return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
            expect(result).not.to.be.empty;
          });
        });
      }); // End of context 'when the invitor accepts the invitation'

      context("when another user accepts the invitation", function() {
        var ERROR;
        beforeEach(function() {
          return Factory('user').then(function(user) {
            return user.acceptHubInvitation(INVITATION._id).catch(function(error) {
              ERROR = error;
            });
          });
        });

        it("throws a notAllowed error (2)", function() {
          expect(ERROR).to.eql("Cannot accept someone else's hub invitation.");
        });
      }); // End of context 'when another user accepts the invitation'
    }); // End of context 'when the invitation exists'

    context("when the invitation doesn't exists", function() {
      it("throws an error", function(done) {
        return USER.acceptHubInvitation(999).then(done, function(error) {
          expect(error).not.to.be.undefined;
          done();
        });
      });
    }); // End of context 'when the invitation doesn't exists'
  }); // End of describe 'acceptHubInvitation'

  describe('destroyHubInvitation', function() {
    context("when the invitation exists", function() {
      var USER_B, HUB, INVITATION;
      beforeEach(function() {
        return Factory('hub').then(function(entities) {
          USER_B = entities.user;
          HUB = entities.hub;
          return USER_B.inviteToHub(HUB._id, USER._id).then(function(invitation) {
            INVITATION = invitation.invitation;
          });
        });
      });

      context("when invitor destroys the invitation", function() {
        it("destroys the HubInvitation node (1)", function() {
          return USER_B.destroyHubInvitation(INVITATION._id).then(function() {
            return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
              expect(result).to.be.empty;
            });
          });
        });
      }); // End of context 'when invitor destroys the invitation'

      context("when the invitee destroys the invitation", function() {
        it("destroys the HubInvitation node (2)", function() {
          return USER.destroyHubInvitation(INVITATION._id).then(function() {
            return db.query("MATCH (hi:HubInvitation) RETURN hi").then(function(result) {
              expect(result).to.be.empty;
            });
          });
        });
      }); // End of context 'when the invitee destroys the invitation'

      context("when another user tries to destroy the invitation", function() {
        var ERROR;
        beforeEach(function() {
          return Factory('user').then(function(user) {
            return user.destroyHubInvitation(INVITATION._id).catch(function(error) {
              ERROR = error;
            });
          });
        });

        it("throws a notAllowed error (3)", function() {
          expect(ERROR).to.eql("Cannot delete someone else's hub invitation.");
        });
      }); // End of context 'when another user tries to destroy the invitation'

      // This is a test inspired by implementation, which is bad not in this case
      // I'm actuallty testing the .. AND .. OR .. clause in the db query to
      // be .. AND ( .. OR .. ) and not (.. AND ..) OR ..
      describe("a receiving user can't delete another existing invitation", function() {
        var OTHER_INVITATION, ERROR;
        beforeEach(function() {
          return Factory('user', {firstName: "USERC"}).then(function(userC) {
            return USER_B.inviteToHub(HUB._id, userC._id).then(function(invitation) {
              OTHER_INVITATION = invitation.invitation;
              return USER.destroyHubInvitation(OTHER_INVITATION._id).catch(function(error) {
                ERROR = error;
              });
            });
          });
        });

        it("throws a notAllowed error (5)", function() {
          expect(ERROR).to.eql("Cannot delete someone else's hub invitation.")
        });
      }); // End of describe '"a receiving user can'
    }); // End of context 'when the invitation exists'

    context("when the invitation doesn't exist", function() {
      var ERROR;
      beforeEach(function() {
        return USER.destroyHubInvitation(123456).catch(function(error) {
          ERROR = error;
        });
      });

      it("throws an error (3)", function() {
        expect(ERROR).not.to.be.undefined;
      });
    }); // End of context 'when the invitation doesn't exist'
  }); // End of describe 'destroyHubInvitation'
}); // End of describe 'USER-HUBS methods'
