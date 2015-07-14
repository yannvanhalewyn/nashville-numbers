var include    = require('include')
  , chai       = require('chai')
  , sinon      = require('sinon')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , login      = include('/test/util/login')
  , Factory    = include('/test/util/factory')
  , Controller = include('/controllers/friend_requests_controller')
  , login      = include('/test/util/login')
chai.use(sinonChai);

include('/test/util/clear_db');

describe('FRIEND_REQUESTS_CONTROLLER', function() {

  var req, res;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    return Factory('user').then(function(userA) {
      this.userA = userA;
    }.bind(this));
  });

  // POST/CREATE
  describe('POST#create', function() {
    beforeEach(function() {
      req.method = "POST";
    });

    context("when otherUser is found", function() {
      beforeEach(function(done) {
        sinon.spy(this.userA, 'sendFriendRequest');
        login(this.userA, req);
        return Factory('user').then(function(otherUser) {
          this.userB = otherUser;
          req.body = { other_user_id: otherUser._id }
          Controller.create(req, res);
          res.on('end', done)
        }.bind(this));
      });

      it("calls sendFriendRequest on userA with id of userB", function() {
        expect(res.sendStatus).to.have.been.calledWith(200);
        expect(this.userA.sendFriendRequest).to.have.been.calledWith(this.userB._id);
      });
    }); // End of context 'when otherUser is found'
  }); // End of describe 'POST#create'

  describe('PUT#update', function() {
    beforeEach(function() {
      req.method = "PUT"
    });

    context("when friend request is found", function() {
      beforeEach(function(done) {
        sinon.spy(this.userA, 'acceptFriendRequest');
        login(this.userA, req);
        return Factory('user').then(function(otherUser) {
          this.userB = otherUser;
          return this.userB.sendFriendRequest(this.userA._id).then(function(request) {
            req.params = { request_id: request._id }
            Controller.update(req, res);
            res.on('end', done)
          });
        }.bind(this));
      });

      it("calls user.acceptFriend with the requestID", function() {
        expect(res.sendStatus).to.have.been.calledWith(200);
        expect(this.userA.acceptFriendRequest).to.have.been.calledWith(req.params.request_id);
      });
    }); // End of context 'when friend request is found'
  }); // End of describe 'PUT#update'
}); // End of describe 'FRIEND_REQUESTS_CONTROLLER'
