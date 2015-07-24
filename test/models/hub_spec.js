var include    = require('include')
  , chai       = require('chai')
  , expect     = chai.expect
  , Hub        = include('/models/hub')
  , db         = include('/config/db')
  , Factory    = include('/test/util/factory')

// Clear DB afterEach()
include('/test/util/clear_db');

describe('HUB', function() {

/*
 * ======
 * Create
 * ======
 */
  describe('Hub.create()', function() {
    var HUB, USER;
    beforeEach(function() {
      return Factory('user').then(function(user) {
        return Hub.create({creator_id: user._id, title: "Some Title", foo: "bar"})
        .then(function(hub) {
          USER = user;
          HUB = hub;
        });
      });
    });

    it("creates a new hub in the db", function() {
      return db.query("MATCH (h:Hub) RETURN h").then(function(result) {
        expect(result.length).to.eql(1);
      });
    });

    it("returns (a promise to) an instance of Hub with the created params", function() {
      expect(HUB).to.be.an.instanceof(Hub);
      expect(HUB.properties.title).to.eql("Some Title");
      expect(HUB.properties.foo).to.eql("bar");
    });

    it("creates a relationship between the {creator_id} user and the new hub", function() {
      return db.query(
        "MATCH (u:Person)-[r:CREATED]-(h:Hub) WHERE id(u) = {uid} AND id(h) = {hid}" +
        "RETURN r", {uid: USER._id, hid: HUB._id}
      ).then(function(result) {
        expect(result.length).to.eql(1);
      });
    });
  }); // End of describe 'Hub.create()'

/*
 * ==========
 * findById()
 * ==========
 */
  describe('Hub.FindById()', function() {

    var CREATED_HUB, FOUND_HUB;

    context("when a hub exists", function() {
      beforeEach(function() {
        return Factory('hub').then(function(entities) {
          return Hub.findById(entities.hub._id.toString()).then(function(foundHub) {
            CREATED_HUB = entities.hub;
            FOUND_HUB = foundHub;
          });
        });
      });

      it("returns the correct hub", function() {
        expect(FOUND_HUB._id).to.equal(CREATED_HUB._id);
        expect(FOUND_HUB.properties).to.eql(CREATED_HUB.properties);
      });

      it("returns an instance of HUB", function() {
        expect(FOUND_HUB).to.be.an.instanceof(Hub);
      });
    }); // End of context 'when a hub exists'

    context("when a hub doesn't exist", function() {
      it("throws a 'hub not found' error", function(done) {
        return Hub.findById(999).then(done, function(err) {
          expect(err).to.eql("Could not find hub with id 999");
          done();
        }).catch(done);
      });
    }); // End of context 'when a hub doesn't exist'
  }); // End of describe 'Hub.FindById()'

  describe('hub#getParticipants()', function() {
    var HUB, CREATOR, USER_A;
    beforeEach(function() {
      return Factory('hub').then(function(entities) {
        HUB = entities.hub;
        CREATOR = entities.user;
        return Factory('user').then(function(participant) {
          USER_A = participant;
          return db.query(
            "MATCH (h:Hub), (p:Person) WHERE id(h) = {hid} AND id(p) = {pid} " +
            "CREATE (p)-[:JOINED {permission: 7}]->(h)",
            {hid: HUB._id, pid: USER_A._id}
          );
        });
      });
    });

    it("returns the participants", function() {
      return HUB.getParticipants().then(function(participants) {
        expect(participants.length).to.eql(2);
        var ids = participants.map(function(p) { return p.user._id })
        expect(ids).to.contain(CREATOR._id)
        expect(ids).to.contain(USER_A._id)
      });
    });

    it("returns the relationships", function() {
      return HUB.getParticipants().then(function(participants) {
        var relationships = participants.map(function(p) { return p.relationship });
        expect(relationships[0].type).to.eql("CREATED");
        expect(relationships[1].properties.permission).to.eql(7);
      });
    });
  }); // End of describe 'hub#getParticipants()'

  describe('getInvitations', function() {
    var HUB, CREATOR;
    beforeEach(function() {
      return Factory('hub').then(function(entities) {
        HUB = entities.hub;
        CREATOR = entities.user;
      });
    });

    context("when there is an invitation", function() {
      var INVITATION, INVITEE;
      beforeEach(function() {
        return Factory('user').then(function(invitee) {
          return CREATOR.inviteToHub(HUB._id, invitee._id).then(function(invitation) {
            INVITATION = invitation.invitation;
            INVITEE = invitee;
          });
        });
      });

      it("returns an array of invitations", function() {
        return HUB.getInvitations().then(function(invitations) {
          expect(invitations.length).to.eql(1);
        });
      });

      it("returns the invitations as well as the invitees", function() {
        return HUB.getInvitations().then(function(invitations) {
          expect(invitations[0].invitation._id).to.eql(INVITATION._id);
          expect(invitations[0].invitee._id).to.eql(INVITEE._id);
        });
      });
    }); // End of context 'when there is an invitation'

    context("when there is no invitation", function() {
      it("returns an empty array", function() {
        return HUB.getInvitations().then(function(invitations) {
          expect(invitations.length).to.eql(0);
        });
      });
    }); // End of context 'when there is no invitation'
  }); // End of describe 'getInvitations'

  describe('removeParticipant', function() {
    var HUB, CREATOR, PARTICIPANT;
    beforeEach(function() {
      return Factory('hub').then(function(entities) {
        HUB = entities.hub;
        CREATOR = entities.user;
        return db.query(
          "MATCH (h:Hub) WHERE id(h) = {hid} CREATE (p:Person)-[:JOINED]->(h) RETURN p",
          {hid: HUB._id}
        ).then(function(result) {
          PARTICIPANT = result[0].p;
        });
      });
    });

    it("destroys the JOINED relationship", function() {
      return HUB.removeParticipant(PARTICIPANT._id.toString()).then(function() {
        return db.query("MATCH ()-[r:JOINED]-() RETURN r").then(function(result) {
          expect(result).to.be.empty;
        });
      });
    });
  }); // End of describe 'removeParticipant'
}); // End of describe 'HUB'
