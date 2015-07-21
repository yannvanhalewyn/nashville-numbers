var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , sinon      = require('sinon')
  , reqres     = require('reqres')
  , Factory    = include('/test/util/factory')
  , Q          = require('q')
  , Controller = include('/controllers/hubs/hub_participants_controller');
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
