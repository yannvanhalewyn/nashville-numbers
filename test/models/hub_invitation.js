var include = require('include')
  , expect  = require('chai').expect
  , Factory = include('/test/util/factory')
  , db      = include('/config/db')
  , HubInvitation = include('/models/hub_invitation')

describe('HubInvitation', function() {
  describe('.findById', function() {
    context("when an invitation exists with given ID", function() {
      var INVITATION, FOUND;
      beforeEach(function() {
        return db.query("CREATE (hi:HubInvitation) return hi").then(function(invitation) {
          INVITATION = invitation[0].hi;
          return HubInvitation.findById(INVITATION._id.toString()).then(function(found) {
            FOUND = found;
          });
        });
      });

      it("finds the hubinvitation", function() {
        expect(FOUND).not.to.be.undefined;
        expect(FOUND._id).to.eql(INVITATION._id)
      });

      it("returns an instance of the HubInvitation class", function() {
        expect(FOUND).to.be.an.instanceof(HubInvitation);
      });

    }); // End of context 'when an invitation exists with given ID'

    context("when hubinvitation doesn't exists", function() {
      var ERROR;
      beforeEach(function() {
        return HubInvitation.findById("invalid").catch(function(error) {
          ERROR = error;
        });
      });

      it("throws a NotFound error", function() {
        expect(ERROR).to.eql("Could not find invitation with id invalid");
      });
    }); // End of context 'when ID is not found'
  }); // End of describe '.findById'

  describe('.findByIdAndSentBy', function() {
    var SENDER, INVITATION;
    beforeEach(function() {
      return Factory('user').then(function(user) {
        return db.query(
          "MATCH (p:Person) WHERE id(p) = {sid} CREATE (p)-[:SENT]->(hi:HubInvitation) RETURN hi",
          {sid: user._id}
        ).then(function(result) {
          INVITATION = result[0].hi;
          SENDER = user;
        });
      });
    });

    context("when invitation and sender match", function() {
      it("returns the invitation as an instance of HubInvitation", function() {
        return HubInvitation.findByIdAndSentBy(INVITATION._id.toString(), SENDER._id.toString())
        .then(function(invitation) {
          expect(invitation._id).to.eql(INVITATION._id);
          expect(invitation).to.be.an.instanceof(HubInvitation);
        });
      });
    }); // End of context 'when invitation and sender match'

    context("when invitation doesn't exist", function() {
      var ERROR;
      beforeEach(function() {
        return HubInvitation.findByIdAndSentBy("invalid", SENDER._id).catch(function(error) {
          ERROR = error;
        });
      });

      it("throws a notfound error (1)", function() {
        expect(ERROR).to.eql("Could not find invitation invalid sent by user " + SENDER._id)
      });
    }); // End of context 'when invitation doesn't exist'

    context("when invitation is not sent by sender", function() {
      var ERROR;
      beforeEach(function() {
        return HubInvitation.findByIdAndSentBy(INVITATION._id, 123).catch(function(error) {
          ERROR = error;
        });
      });

      it("throws a notfound error (2)", function() {
        expect(ERROR).to.eql("Could not find invitation " + INVITATION._id + " sent by user 123");
      });
    }); // End of context 'when invitation is not sent by sender'
  }); // End of describe '.findByIdAndSentBy'

  describe('.findByIdAndSentTo', function() {
    var RECEIVER, INVITATION;
    beforeEach(function() {
      return Factory('user').then(function(user) {
        return db.query(
          "MATCH (p:Person) WHERE id(p) = {rid} CREATE (hi:HubInvitation)-[:TO]->(p) RETURN hi",
          {rid: user._id}
        ).then(function(result) {
          INVITATION = result[0].hi;
          RECEIVER = user;
        });
      });
    });

    context("when invitation and receiver match", function() {
      it("returns the invitation as an instance of HubInvitation (2)", function() {
        return HubInvitation.findByIdAndSentTo(INVITATION._id.toString(), RECEIVER._id.toString())
        .then(function(invitation) {
          expect(invitation._id).to.eql(INVITATION._id);
          expect(invitation).to.be.an.instanceof(HubInvitation);
        });
      });
    }); // End of context 'when invitation and sender match'

    context("when invitation doesn't exist", function() {
      var ERROR;
      beforeEach(function() {
        return HubInvitation.findByIdAndSentTo("invalid", RECEIVER._id).catch(function(error) {
          ERROR = error;
        });
      });

      it("throws a notfound error (3)", function() {
        expect(ERROR).to.eql("Could not find invitation invalid sent to user " + RECEIVER._id)
      });
    }); // End of context 'when invitation doesn't exist'

    context("when invitation is not sent to receiver", function() {
      var ERROR;
      beforeEach(function() {
        return HubInvitation.findByIdAndSentTo(INVITATION._id, 123).catch(function(error) {
          ERROR = error;
        });
      });

      it("throws a notfound error (4)", function() {
        expect(ERROR).to.eql("Could not find invitation " + INVITATION._id + " sent to user 123");
      });
    }); // End of context 'when invitation is not sent by sender'
  }); // End of describe '.findByIdAndSentBy'

  describe('#setPermissionValue', function() {
    var INSTANCE, UPDATED_INSTANCE;
    beforeEach(function() {
      return db.query("CREATE (hi:HubInvitation) return hi").then(function(invitation) {
        INSTANCE = new HubInvitation(invitation[0].hi);
        return INSTANCE.setPermissionValue(15).then(function(updatedInstance) {
          UPDATED_INSTANCE = updatedInstance;
        });
      });
    });

    it("returns an updated instance of HubInvitation", function() {
      expect(UPDATED_INSTANCE).to.be.an.instanceOf(HubInvitation)
      expect(UPDATED_INSTANCE._id).to.eql(INSTANCE._id);
    });

    it("has set the permissions property", function() {
      expect(UPDATED_INSTANCE.properties.permissions).to.eql(15);
    });
  }); // End of describe '#setPermissionValue'
}); // End of describe 'HubInvitation'
