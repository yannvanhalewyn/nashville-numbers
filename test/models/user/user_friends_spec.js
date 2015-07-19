var include = require('include')
  , expect  = require('chai').expect
  , user    = include('/models/user')
  , Factory = include('/test/util/factory')
  , db      = include('/config/db')
  , Q = require('q')

include('/test/util/clear_db');

describe('USER#friends', function() {
  var USER_A, USER_B;
  beforeEach(function() {
    return Factory('user').then(function(userA) {
      USER_A = userA;
      return Factory('user').then(function(userB) {
        USER_B = userB;
      });
    });
  });


/*
 * =================
 * sendFriendRequest
 * =================
 */
  describe('#sendFriendRequest()', function() {
    context("when no relation pre-exists", function() {
      var RESULT;
      beforeEach(function() {                // toString to simulate data from req
        return USER_A.sendFriendRequest(USER_B._id.toString())
        .then(function(result) {
          RESULT = result;
        });
      });

      it("creates a new friendRequest node from userA to userB", function() {
        return db.query(
          "MATCH (u:Person), (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN u,f"
        ).then(function(result) {
          expect(result.length).to.eql(1);
          expect(result[0].u._id).to.eql(USER_A._id);
          expect(result[0].f._id).to.eql(USER_B._id);
        });
      });

      it("returns the request object", function() {
        expect(RESULT._id).not.to.be.undefined;
      });
    }); // End of context 'when no relation pre-exists'

    context("when a request node already exists", function() {
      beforeEach(function() {
        return USER_A.sendFriendRequest(USER_B._id);
      });

      context("when that node has the same target user", function() {
        beforeEach(function() {
          return USER_A.sendFriendRequest(USER_B._id);
        });

        it("doesn't create another friendrequest node", function() {
          return db.query(
            "MATCH (u:Person), (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN r"
          ).then(function(result) {
            expect(result.length).to.eql(1);
          });
        });
      }); // End of context 'when that node has the same target user'

      context("when that node is coming in from the other user", function() {
        beforeEach(function() {
          return USER_B.sendFriendRequest(USER_A._id);
        });

        it("doesn't create a cross request", function() {
          return db.query(
            "MATCH (u:Person)-[]->(r:FriendRequest)-[]->(f:Person) RETURN r"
          ).then(function(result) {
            expect(result.length).to.eql(1);
          });
        });
      }); // End of context 'when that node is coming in from the other user'

      context("when that node has a different target user", function() {
        beforeEach(function() {
          return Factory('user').then(function(userC) {
            return USER_A.sendFriendRequest(userC._id);
          })
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
          "CREATE (b)-[:FRIEND]->(a)",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          return USER_A.sendFriendRequest(USER_B._id);
        });
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


/*
 * =====================
 * acceptFriendRequest()
 * =====================
 */
  describe('#acceptFriendRequest()', function() {
    context("when there is a request from userB to userA", function() {
      var RETURNED_RELATIONSHIP;
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          return USER_A.acceptFriendRequest(result[0].r._id.toString())
          .then(function(relationship) {
            RETURNED_RELATIONSHIP = relationship;
          })
        });
      });

      it("deletes the request node", function() {
        return db.query(
          "MATCH (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(response) {
          expect(response.length).to.eql(0);
        })
      });

      it("creates a FRIEND relationship", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          expect(result.length).to.eql(1);
        });
      });

      it("returns the newly created realtionship", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          expect(RETURNED_RELATIONSHIP).to.eql(result[0].r);
        });
      });
    }); // End of context 'when the relationship is already pending'

    context("when no relationship is pending", function() {
      it("does nothing", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN a,b,r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'when no relationship is pending'

    context("when userC accepts a request between userA and userB", function() {
      beforeEach(function() {
        return Factory('user').then(function(userC) {
          return USER_A.sendFriendRequest(USER_B._id).then(function(request) {
            return userC.acceptFriendRequest(request._id);
          })
        })
      });

      it("obviously doesn't execute", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          expect(result.length).to.eql(0);
        });
      });
    }); // End of context 'when userC accepts a request between userA and userB'
  }); // End of describe '#acceptFriendRequest()'

/*
 * ====================
 * destroyFriendRequest
 * ====================
 */
  describe('#destroyFriendRequest()', function() {
    context("when there is a request from userB to userA", function() {
      var REQUEST;
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          REQUEST = result[0].r;
        });
      });

      it("userA can delete the request", function() {
        return USER_A.destroyFriendRequest(REQUEST._id).then(function() {
          return db.query(
            "MATCH (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) " +
              "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
            {aid: USER_A._id, bid: USER_B._id}
          ).then(function(response) {
            expect(response.length).to.eql(0);
          })
        })
      });

      it("userB can delete the request", function() {
        return USER_B.destroyFriendRequest(REQUEST._id).then(function() {
          return db.query(
            "MATCH (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) " +
              "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
            {aid: USER_A._id, bid: USER_B._id}
          ).then(function(response) {
            expect(response.length).to.eql(0);
          })
        })
      });
    }); // End of context 'when the relationship is already pending'

    context("when userC destroys a request between userA and userB", function() {
      beforeEach(function() {
        return Factory('user').then(function(userC) {
          return USER_A.sendFriendRequest(USER_B._id).then(function(request) {
            return userC.destroyFriendRequest(request._id);
          })
        })
      });

      it("obviously doesn't execute", function() {
        return db.query(
          "MATCH (a:Person)-[]-(r:FriendRequest)-[]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          expect(result.length).to.eql(1);
        });
      });
    }); // End of context 'when userC accepts a request between userA and userB'
  }); // End of describe '#acceptFriendRequest()'


/*
 * ============
 * deleteFriend
 * ============
 */
  describe('#deleteFriend', function() {
    context("when actually friends", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (a)-[:FRIEND]->(b)",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function() {
          return USER_A.deleteFriend(USER_B._id.toString());
        });
      });

      it("deletes the friendship", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: USER_A._id, bid: USER_B._id}
        ).then(function(result) {
          expect(result.length).to.eql(0);
        })
      });
    }); // End of context 'when actually friends'
  }); // End of describe '#deleteFriend'

  describe('#getOpenFriendRequests', function() {
    var REQUEST;
    beforeEach(function() {
      return USER_B.sendFriendRequest(USER_A._id).then(function(request) {
        REQUEST = request;
      })
    });

    it("returns the requests", function() {
      return USER_A.getOpenFriendRequests().then(function(result) {
        expect(result.length).to.eql(1);
        expect(result[0].request._id).to.eql(REQUEST._id);
      })
    });

    it("returns an embedded user object from whom the request is coming", function() {
      return USER_A.getOpenFriendRequests().then(function(result) {
        expect(result.length).to.eql(1);
        expect(result[0].sender._id).to.eql(USER_B._id);
      })
    });
  }); // End of describe '#getOpenFriendRequests'


/*
 * =============
 * getFriendship
 * =============
 */
  describe('#getFriendship', function() {
    context("when user A is friends with user B", function() {
      var FRIENDSHIP;
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (a)-[r:FRIEND]->(b)" +
          "RETURN r", {aid: USER_A._id, bid: USER_B._id}
        ).then(function(response) {
          FRIENDSHIP = response[0].r;
        })
      });

      it("returns the an object with the friendship relationship and null requests", function() {
        return USER_A.getFriendship(USER_B._id).then(function(response) {
          expect(response.sentRequest).to.be.null;
          expect(response.receivedRequest).to.be.null;
          expect(response.friendship).to.eql(FRIENDSHIP);
        });
      });
    }); // End of context 'when user A is friends with user B'

    context("when User A has no link to user B", function() {
      it("returns an object with null friendship and null requsts", function() {
        return USER_A.getFriendship(USER_B._id).then(function(response) {
          expect(response.sentRequest).to.be.null;
          expect(response.receivedRequest).to.be.null;
          expect(response.friendship).to.be.null;
        });
      });
    }); // End of context 'when User A has no link to user B'

    context("when User A has sent a friend request to user B", function() {
      var REQUEST;
      beforeEach(function() {
        return USER_A.sendFriendRequest(USER_B._id).then(function(request) {
          REQUEST = request;
        });
      });

      it("returns and object with a valid sentRequest node", function() {
        return USER_A.getFriendship(USER_B._id).then(function(result) {
          expect(result.friendship).to.be.null;
          expect(result.receivedRequest).to.be.null;
          expect(result.sentRequest).to.eql(REQUEST);
        });
      });
    }); // End of context 'when User A has sent a friend request to user B'

    context("when user B has sent a friend request to user A", function() {
      var REQUEST;
      beforeEach(function() {
        return USER_B.sendFriendRequest(USER_A._id).then(function(request) {
          REQUEST = request;
        });
      });

      it("returns an object with a valid received request node", function() {
        return USER_A.getFriendship(USER_B._id).then(function(result) {
          expect(result.friendship).to.be.null;
          expect(result.sentRequest).to.be.null;
          expect(result.receivedRequest).to.eql(REQUEST);
        });
      });
    }); // End of context 'when user B has sent a friend request to user A'
  }); // End of describe '#getFriendshipStatus'

  describe('findFriends', function() {
    var USER_C, USER_D;
    beforeEach(function() {
      return db.query(
        "MATCH (a:Person) WHERE id(a) = {aid} " +
        "CREATE (a)-[:FRIEND]->(c:Person {firstName: 'James', lastName: 'May'}), " +
        "(a)-[:FRIEND]->(d:Person {firstName: 'Fred', lastName: 'Jamerson'}) " +
        "RETURN c,d", {aid: USER_A._id, bid: USER_B._id}
      ).then(function(response) {
        USER_C = response[0].c;
        USER_D = response[0].d;
      })
    });

    context("when query matches part of a firstName", function() {
      it("returns the correct friend (1)", function() {
        return USER_A.findFriends("ames").then(function(found) {
          expect(found.length).to.eql(1);
          expect(found[0]._id).to.eql(USER_C._id);
        });
      });
    }); // End of context 'when query matches part of a firstName'

    context("when query matches part of lastName", function() {
      it("returns the correct friend (2)", function() {
        return USER_A.findFriends("erso").then(function(found) {
          expect(found.length).to.eql(1);
          expect(found[0]._id).to.eql(USER_D._id);
        });
      });
    }); // End of context 'when query matches part of lastName'

    context("when query = part of firstName and part of lastName as multiple words", function() {
      it("returns the correct friend (3)", function() {
        return USER_A.findFriends("jame ay ").then(function(found) {
          expect(found.length).to.eql(1);
          expect(found[0]._id).to.eql(USER_C._id);
        });
      });
    }); // End of context 'when query part of firstName and part of lastName as multiple words'

    context("when query matches multiple friends", function() {
      it("returns all those friends", function() {
        return USER_A.findFriends("jame").then(function(found) {
          expect(found.length).to.eql(2);
          expect(found[0]._id).to.eql(USER_C._id);
          expect(found[1]._id).to.eql(USER_D._id);
        });
      });
    }); // End of context 'when query matches multiple friends'

    context("when no friends are found", function() {
      it("returns an empty array", function() {
        return USER_A.findFriends("skajs").then(function(found) {
          expect(found).to.eql([]);
        });
      });
    }); // End of context 'when no friends are found'
  }); // End of describe 'findFriends'
}); // End of describe 'USER#friends'
