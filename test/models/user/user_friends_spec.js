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


/*
 * =================
 * sendFriendRequest
 * =================
 */
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

      context("when that node is coming in from the other user", function() {
        beforeEach(function() {
          return this.userB.sendFriendRequest(this.userA._id);
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
          "CREATE (b)-[:FRIEND]->(a)",
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


/*
 * =====================
 * acceptFriendRequest()
 * =====================
 */
  describe('#acceptFriendRequest()', function() {
    context("when there is a request from userB to userA", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          return this.userA.acceptFriendRequest(result[0].r._id.toString())
          .then(function(relationship) {
            this.returnedRelation = relationship;
          }.bind(this))
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

      it("returns the newly created realtionship", function() {
        return db.query(
          "MATCH (a:Person)-[r:FRIEND]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          expect(this.returnedRelation).to.eql(result[0].r);
        }.bind(this));
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

/*
 * ====================
 * destroyFriendRequest
 * ====================
 */
  describe('#destroyFriendRequest()', function() {
    context("when there is a request from userB to userA", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
        ).then(function(result) {
          this.request = result[0].r;
        }.bind(this));
      });

      it("userA can delete the request", function() {
        return this.userA.destroyFriendRequest(this.request._id).then(function() {
          return db.query(
            "MATCH (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) " +
              "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
            {aid: this.userA._id, bid: this.userB._id}
          ).then(function(response) {
            expect(response.length).to.eql(0);
          })
        }.bind(this))
      });

      it("userB can delete the request", function() {
        return this.userB.destroyFriendRequest(this.request._id).then(function() {
          return db.query(
            "MATCH (b)-[:SENT]->(r:FriendRequest)-[:TO]->(a) " +
              "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
            {aid: this.userA._id, bid: this.userB._id}
          ).then(function(response) {
            expect(response.length).to.eql(0);
          })
        }.bind(this))
      });
    }); // End of context 'when the relationship is already pending'

    context("when userC destroys a request between userA and userB", function() {
      beforeEach(function() {
        return Factory('user').then(function(userC) {
          return this.userA.sendFriendRequest(this.userB._id).then(function(request) {
            return userC.destroyFriendRequest(request._id);
          })
        }.bind(this))
      });

      it("obviously doesn't execute", function() {
        return db.query(
          "MATCH (a:Person)-[]-(r:FriendRequest)-[]-(b:Person) " +
          "WHERE id(a) = {aid} AND id(b) = {bid} RETURN r",
          {aid: this.userA._id, bid: this.userB._id}
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
        expect(result[0].request._id).to.eql(this.request._id);
      })
    });

    it("returns an embedded user object from whom the request is coming", function() {
      return this.userA.getOpenFriendRequests().then(function(result) {
        expect(result.length).to.eql(1);
        expect(result[0].sender._id).to.eql(this.userB._id);
      }.bind(this))
    });
  }); // End of describe '#getOpenFriendRequests'


/*
 * =============
 * getFriendship
 * =============
 */
  describe('#getFriendship', function() {
    context("when user A is friends with user B", function() {
      beforeEach(function() {
        return db.query(
          "MATCH (a:Person), (b:Person) WHERE id(a) = {aid} AND id(b) = {bid} " +
          "CREATE (a)-[r:FRIEND]->(b)" +
          "RETURN r", {aid: this.userA._id, bid: this.userB._id}
        ).then(function(response) {
          this.friendship = response[0].r;
        }.bind(this))
      });

      it("returns the an object with the friendship relationship and null requests", function() {
        return this.userA.getFriendship(this.userB._id).then(function(response) {
          expect(response.sentRequest).to.be.null;
          expect(response.receivedRequest).to.be.null;
          expect(response.friendship).to.eql(this.friendship);
        }.bind(this));
      });
    }); // End of context 'when user A is friends with user B'

    context("when User A has no link to user B", function() {
      it("returns an object with null friendship and null requsts", function() {
        return this.userA.getFriendship(this.userB._id).then(function(response) {
          expect(response.sentRequest).to.be.null;
          expect(response.receivedRequest).to.be.null;
          expect(response.friendship).to.be.null;
        });
      });
    }); // End of context 'when User A has no link to user B'

    context("when User A has sent a friend request to user B", function() {
      beforeEach(function() {
        return this.userA.sendFriendRequest(this.userB._id).then(function(request) {
          this.request = request;
        }.bind(this));
      });

      it("returns and object with a valid sentRequest node", function() {
        return this.userA.getFriendship(this.userB._id).then(function(result) {
          expect(result.friendship).to.be.null;
          expect(result.receivedRequest).to.be.null;
          expect(result.sentRequest).to.eql(this.request);
        }.bind(this));
      });
    }); // End of context 'when User A has sent a friend request to user B'

    context("when user B has sent a friend request to user A", function() {
      beforeEach(function() {
        return this.userB.sendFriendRequest(this.userA._id).then(function(request) {
          this.request = request;
        }.bind(this));
      });

      it("returns an object with a valid received request node", function() {
        return this.userA.getFriendship(this.userB._id).then(function(result) {
          expect(result.friendship).to.be.null;
          expect(result.sentRequest).to.be.null;
          expect(result.receivedRequest).to.eql(this.request);
        }.bind(this));
      });
    }); // End of context 'when user B has sent a friend request to user A'
  }); // End of describe '#getFriendshipStatus'
}); // End of describe 'USER#friends'
