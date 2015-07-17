var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , sinon      = require('sinon')
  , expect     = chai.expect
  , Controller = include('/controllers/friends_controller')
  , reqres     = require('reqres')
  , Factory    = include('/test/util/factory')
  , db         = include('/config/db')
  , Q          = require('q')
chai.use(sinonChai);

// Clear the db aftereach
include('/test/util/clear_db')

describe('FRIENDSROUTES', function() {

  var req, res;
  var USER_A, USER_B;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    return Factory('user').then(function(userA) {
      return Factory('user').then(function(userB) {
        USER_A = userA;
        USER_B = userB;
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (a)-[:FRIENDS]->(b)", {aid: userA._id, bid: userB._id}
        );
      });
    });
  });

  // INDEX
  describe('GET#index', function() {
    beforeEach(function(done) {
      Controller.index(req, res);
      res.on('end', done);
    });

    it("renders the friends page", function() {
      expect(res.render).to.have.been.calledWith('friends');
    });
  }); // End of describe 'GET#index'

  describe('GET#show', function() {
    beforeEach(function(done) {
      sinon.stub(USER_A, 'getFriendship').returns(Q(dummyFriendship()));
      req.user = USER_A;
      req.params.friend_id = USER_B._id;
      Controller.show(req, res);
      res.on('end', done);
    });

    it("calls getFriendship on userA with userB's id", function() {
      expect(USER_A.getFriendship).to.have.been.calledWith(USER_B._id);
    });

    it("sends along the friendship data via json", function() {
      expect(res.json).to.have.been.calledWith(dummyFriendship());
    });
  }); // End of describe 'GET#show'

  describe('DELETE#destroy', function() {
    beforeEach(function(done) {
      sinon.stub(USER_A, 'deleteFriend').returns(Q());
      req.user = USER_A;
      req.params.friend_id = USER_B._id;
      Controller.destroy(req, res);
      res.on('end', done);
    });

    it("calls userA.deleteFriend with userB's id", function() {
      expect(USER_A.deleteFriend).to.have.been.calledWith(USER_B._id);
    });

    it("returns a deleted flag", function() {
      expect(res.json).to.have.been.calledWith({type: 'destroyed'});
    });
  }); // End of describe 'DELETE#destroy'
}); // End of describe 'FRIENDSROUTES'

function dummyFriendship() {
  return {
    friendship: null,
    sentRequest: {
      _id: 99
    },
    receivedRequest: null
  }
}
