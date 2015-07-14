var include = require('include')
  , expect  = require('chai').expect
  , user    = include('/models/user')
  , Factory = include('/test/util/factory')
  , db      = include('/config/db')
  , Q = require('q')

include('/test/util/clear_db');

describe('USER#friends', function() {
  beforeEach(function() {
    return Factory('user').then(function(userA) {
      this.userA = userA;
      return Factory('user').then(function(userB) {
        this.userB = userB;
      }.bind(this));
    }.bind(this));
  });

  describe('#sendFriendRequest()', function() {
    context("when no relation pre-exists", function() {
      beforeEach(function() {
        return this.userA.sendFriendRequest(this.userB._id);
      });

      it("creates a new friendRequest node from userA to userB", function() {
        return db.query(
          "MATCH (u:Person), (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN u,f"
        ).then(function(result) {
          expect(result.length).to.eql(1);
          expect(result[0].u._id).to.eql(this.userA._id);
          expect(result[0].f._id).to.eql(this.userB._id);
        }.bind(this));
      });
    }); // End of context 'when no relation pre-exists'

    context("when a request node already exists", function() {
      beforeEach(function() {
        return this.userA.sendFriendRequest(this.userB._id).then(function() {
          return this.userA.sendFriendRequest(this.userB._id);
        }.bind(this))
      });

      it("doesn't create multiple relationships", function() {
        return db.query(
          "MATCH (u:Person), (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          expect(result.length).to.eql(1);
        });
      });
    }); // End of context 'when a request is already pending'

    context("when userB is already a friend", function() {
      it("doesn't reset the relationship", function() {
      });
    }); // End of context 'when userB is already a friend'
  }); // End of describe '#sendFriendRequest()'

  describe('#acceptFriendRequest()', function() {
    context("when there is a request from userB to userA", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a)",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function() {
          return this.userA.acceptFriend(this.userB._id);
        }.bind(this));
      });

      it("deletes the request node", function() {
        return db.query(
          "MATCH (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(response) {
          expect(response.length).to.eql(0);
        })
      });

      it("creates a FRIEND relationship", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          expect(result.length).to.eql(1);
        });
      });
    }); // End of context 'when the relationship is already pending'

    context("when no relationship is pending", function() {
      it("does nothing", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN a,b,r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'when no relationship is pending'
  }); // End of describe '#acceptFriendRequest()'

  describe('#deleteFriend', function() {
    context("when actually friends", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (a)-[:FRIEND]->(b)",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function() {
          return this.userA.deleteFriend(this.userB._id);
        }.bind(this));
      });

      it("deletes the friendship", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          expect(result.length).to.eql(0);
        })
      });
    }); // End of context 'when actually friends'

  }); // End of describe '#deleteFriend'
}); // End of describe 'USER#friends'
