var include    = require('include')
  , chai       = require('chai')
  , sinon      = require('sinon')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Q          = require('q')
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

  // GET/INDEX
  describe('GET#index', function() {
    var dummyRequests = [{_id: 1}, {_id: 2}];
    beforeEach(function(done) {
      sinon.stub(this.userA, 'getOpenFriendRequests').returns(Q(dummyRequests));
      req.user = this.userA;
      Controller.index(req, res);
      res.on('end', done);
    });

    it("returns an array of all the logged in users open friend request", function() {
      expect(res.json).to.have.been.calledWith(dummyRequests);
    });
  }); // End of describe 'GET#index'

  // POST/CREATE
  describe('POST#create', function() {
    beforeEach(function() {
      req.method = "POST";
    });

    context("when otherUser is found", function() {
      beforeEach(function(done) {
        sinon.stub(this.userA, 'sendFriendRequest').returns(Q({dummyObject: true}))
        login(this.userA, req);
        return Factory('user').then(function(otherUser) {
          this.userB = otherUser;
          req.body = { other_user_id: otherUser._id }
          Controller.create(req, res);
          res.on('end', done)
        }.bind(this));
      });

      it("calls sendFriendRequest on userA with id of userB", function() {
        expect(this.userA.sendFriendRequest).to.have.been.calledWith(this.userB._id);
      });

      it("returns the newly created request as json with 'sent' flag", function() {
        expect(res.json).to.have.been.calledWith({type: 'sent', request: { dummyObject: true }});
      });
    }); // End of context 'when otherUser is found'
  }); // End of describe 'POST#create'

  describe('PUT#update', function() {
    beforeEach(function() {
      req.method = "PUT"
    });

    context("when friend request is found", function() {
      beforeEach(function(done) {
        sinon.stub(this.userA, 'acceptFriendRequest').returns(Q({dummyData: true}))
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
        expect(this.userA.acceptFriendRequest).to.have.been.calledWith(req.params.request_id);
      });

      it("sends the newly created relationship as json with 'accepted' flag", function() {
        expect(res.json).to.have.been.calledWith({type: 'accepted', relationship: {dummyData: true}});
      });
    }); // End of context 'when friend request is found'
  }); // End of describe 'PUT#update'

  describe('DELETE#destroy', function() {
    beforeEach(function() {
      req.method = "PUT"
    });

    context("when friend request is found", function() {
      beforeEach(function(done) {
        sinon.stub(this.userA, 'destroyFriendRequest').returns(Q())
        req.user = this.userA;
        return Factory('user').then(function(otherUser) {
          this.userB = otherUser;
          return this.userB.sendFriendRequest(this.userA._id).then(function(request) {
            req.params = { request_id: request._id }
            Controller.destroy(req, res);
            res.on('end', done)
          });
        }.bind(this));
      });

      it("calls userA.destroyFriendRequest with the requestID", function() {
        expect(this.userA.destroyFriendRequest).to.have.been.calledWith(req.params.request_id);
      });

      it("sends the deleted flag as json", function() {
        expect(res.json).to.have.been.calledWith({type: "destroyed"});
      });
    }); // End of context 'when friend request is found'
  }); // End of describe 'DELETE#destroy'
}); // End of describe 'FRIEND_REQUESTS_CONTROLLER'
