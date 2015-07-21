var include    = require('include')
  , sinon      = require('sinon')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Controller = include('/controllers/users/user_hub_invitations_controller')
  , Factory    = include('/test/util/factory')
  , Q          = require('q')
  , _          = require('lodash')
chai.use(sinonChai);

describe('UserHubInvitationsController', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('GET/index', function() {
    var USER;
    beforeEach(function(done) {
      return Factory('user').then(function(user) {
        sinon.stub(user, "getHubInvitations").returns(Q(dummyInvitations()));
        req.user = user;
        Controller.index(req, res);
        USER = user;
        res.on('end', done)
      });
    });

    it("calls getHubInvitations on the target_user", function() {
      expect(USER.getHubInvitations).to.have.been.called;
    });

    it("sends the results along as json", function() {
      expect(res.json).to.have.been.calledWith(dummyInvitations());
    });
  }); // End of describe 'GET/index'
}); // End of describe 'USER_CONTROLLER'

function dummyInvitations() {
  return [
    {
      sender: {_id: 1},
      hub: {_id: 2},
      invitation: { _id: 3 }
    },
    {
      sender: {_id: 4},
      hub: {_id: 5},
      invitation: { _id: 6 }
    },
    {
      sender: {_id: 7},
      hub: {_id: 8},
      invitation: { _id: 9 }
    }
  ];
}
