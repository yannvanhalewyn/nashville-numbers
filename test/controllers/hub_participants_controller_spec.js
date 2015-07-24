var include          = require('include')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , sinon            = require('sinon')
  , reqres           = require('reqres')
  , Factory          = include('/test/util/factory')
  , Q                = require('q')
  , Controller       = include('/controllers/hubs/hub_participants_controller')
  , rejectionPromise = include('/test/util/rejectionPromise')
chai.use(sinonChai);

describe('HubParticipantsController', function() {
  var req, res, HUB, CREATOR;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    return Factory('hub').then(function(entities) {
      HUB = entities.hub;
      CREATOR = entities.user;
    });
  });

  describe('GET/index', function() {
    beforeEach(function(done) {
      req.target_hub = HUB;
      sinon.stub(HUB, 'getParticipants').returns(Q(dummyParticipants()));
      Controller.index(req, res);
      res.on('end', done)
    });

    it("calls getParticipants on the target HUB", function() {
      expect(HUB.getParticipants).to.have.been.called;
    });

    it("returns the result of hub.getParticipants", function() {
      expect(res.json).to.have.been.calledWith(dummyParticipants());
    });
  }); // End of describe 'GET/index'

  describe('DELETE/destroy', function() {
    var PARTICIPANT;
    beforeEach(function() {
      return Factory('user').then(function(participant) {
        PARTICIPANT = participant;
        req.user = CREATOR;
        req.target_hub = HUB;
        req.params = {hub_id: HUB._id, participant_id: 123};
      });
    });

    context("on success", function() {
      beforeEach(function(done) {
        sinon.stub(HUB, 'removeParticipant').returns(Q());
        Controller.destroy(req, res);
        res.on('end', done);
      });

      it("calls hub.removeParticipant with the participant_id", function() {
        expect(HUB.removeParticipant).to.have.been.calledWith(123);
      });

      it("sends {destroyed: true} as json", function() {
        expect(res.json).to.have.been.calledWith({destroyed: true});
      });
    }); // End of context 'on success'

    context("on error", function() {
      beforeEach(function(done) {
        sinon.stub(HUB, 'removeParticipant').returns(rejectionPromise("THE ERROR"));
        Controller.destroy(req, res);
        res.on('end', done);
      });

      it("sends a 400 with the error", function() {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith("THE ERROR");
      });
    }); // End of context 'on error'

  }); // End of describe 'DELETE/destroy'

  describe('DELETE/leave', function() {
    var PARTICIPANT;
    beforeEach(function() {
      return Factory('user').then(function(participant) {
        PARTICIPANT = participant;
        req.user = participant;
        req.target_hub = HUB;
        req.params = {hub_id: HUB._id, participant_id: 'me'};
      });
    });

    context("on success", function() {
      beforeEach(function(done) {
        sinon.stub(HUB, 'removeParticipant').returns(Q());
        Controller.leave(req, res);
        res.on('end', done);
      });

      it("calls hub.removeParticipant with the logged in user ID", function() {
        expect(HUB.removeParticipant).to.have.been.calledWith(PARTICIPANT._id);
      });

      it("redirects to hubs page", function() {
        expect(res.redirect).to.have.been.calledWith('/hubs');
      });
    }); // End of context 'on success'

    context("on error", function() {
      beforeEach(function(done) {
        sinon.stub(HUB, 'removeParticipant').returns(rejectionPromise("THE ERROR"));
        Controller.leave(req, res);
        res.on('end', done);
      });

      it("sends a 400 with the error (2)", function() {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith("THE ERROR");
      });
    }); // End of context 'on error'

  }); // End of describe 'DELETE/destroy'
}); // End of describe 'HubParticipantsController'

function dummyParticipants() {
  return [
    {
      user: { _id: 123, properties: { firstName: "Yann" } },
      relationship: { _id: 124, type: "CREATED", properties: {} }
    },
    {
      user: { _id: 125, properties: { firstName: "Fred" } },
      relationship: { _id: 126, type: "JOINED", properties: { permission: 7 } }
    }
  ]
}
