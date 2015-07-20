var include    = require('include')
  , chai       = require('chai')
  , expect     = chai.expect
  , sinonChai = require('sinon-chai')
  , sinon      = require('sinon')
  , reqres     = require('reqres')
  , Controller = include('/controllers/hub_invitations_controller')
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
    _id: 123,
    properties: {}
  }
}

