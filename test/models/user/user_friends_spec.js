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
      beforeEach(function() {                // toString to simulate data from req
        return this.userA.sendFriendRequest(this.userB._id.toString())
        .then(function(result) {
          this.result = result;
        }.bind(this));
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

      it("returns the request object", function() {
        expect(this.result._id).not.to.be.undefined;
      });
    }); // End of context 'when no relation pre-exists'

    context("when a request node already exists", function() {
      beforeEach(function() {
        return this.userA.sendFriendRequest(this.userB._id);
      });

      context("when that node has the same target user", function() {
        beforeEach(function() {
          return this.userA.sendFriendRequest(this.userB._id);
        });

        it("doesn't create another friendrequest node", function() {
          return db.query(
            "MATCH (u:Person), (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN r"
          ).then(function(result) {
            expect(result.length).to.eql(1);
          });
        });
      }); // End of context 'when that node has the same target user'

      context("when that node has a different target user", function() {
        beforeEach(function() {
          return Factory('user').then(function(userC) {
            return this.userA.sendFriendRequest(userC._id);
          }.bind(this))
        });

        it("creates a new request node", function() {
          return db.query(
            "MATCH (u:Person), (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN r"
          ).then(function(result) {
            expect(result.length).to.eql(2);
            expect(result[0]).not.to.eql(result[1]);
          });
        });
      }); // End of context 'when that node has a different target user'
    }); // End of context 'when a request is already pending'

    context("when users are already friends", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (b)-[:FRIENDS]->(a)",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          return this.userA.sendFriendRequest(this.userB._id);
        }.bind(this));
      });

      it("doesn't create a new friendRequest", function() {
        return db.query(
          "MATCH (u:Person), (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN r"
        ).then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'when users are already friends'
  }); // End of describe '#sendFriendRequest()'

  describe('#acceptFriendRequest()', function() {
    context("when there is a request from userB to userA", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          return this.userA.acceptFriendRequest(result[0].r._id.toString());
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

    context("when userC accepts a request between userA and userB", function() {
      beforeEach(function() {
        return Factory('user').then(function(userC) {
          return this.userA.sendFriendRequest(this.userB._id).then(function(request) {
            return userC.acceptFriendRequest(request._id);
          })
        }.bind(this))
      });

      it("obviously doesn't execute", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'when userC accepts a request between userA and userB'
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
          return this.userA.deleteFriend(this.userB._id.toString());
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

  describe('#getOpenFriendRequests', function() {
    beforeEach(function() {
      return this.userB.sendFriendRequest(this.userA._id).then(function(request) {
        this.request = request;
      })
    });

    it("returns the requests", function() {
      return this.userA.getOpenFriendRequests().then(function(result) {
        expect(result.length).to.eql(1);
        expect(result[0]._id).to.eql(this.request._id);
      })
    });
  }); // End of describe '#getOpenFriendRequests'
}); // End of describe 'USER#friends'
