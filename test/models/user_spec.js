var include = require('include')
  , expect  = require('chai').expect
  , User    = include('/models/user')
  , Factory = include('/test/util/factory')
  , db = include('/config/db')

describe('User', function() {
  beforeEach(function() {
    this.validParams = {
      firstName: "Yann",
      lastName: "Vanhalewyn",
      provider_id: 1234,
      provider: "facebook"
    };
  });

  context("instantiation", function() {
    it("stores a valid object", function() {
      return User.create(this.validParams)
      .then(function(user) {
        expect(user._id).to.be.above(0);
        expect(user.properties.firstName).to.eql("Yann");
        expect(user.properties.lastName).to.eql("Vanhalewyn");
      });
    });
  }); // End of context 'instantiation'

  describe('#createSheet()', function() {
    beforeEach(function() {
      return Factory('user').then(function(user) {
        this.user = user;
        return user.createSheet({title: "theTitle", artist: "theArtist", visibility: "private"})
      }.bind(this))
    });

    it("creates a new sheet with a relationship to the user", function() {
      // Check with the db
      return db.query(
        "MATCH (p:Person)-[:AUTHORED]->(s:Sheet) WHERE id(p) = {uid} RETURN p,s",
        {uid: this.user._id}
      ).then(function(res) {
        expect(res.length).to.eql(1);
        expect(res[0].p._id).to.eql(this.user._id);
        expect(res[0].s.properties.title).to.eql("theTitle");
      }.bind(this))
    });
  }); // End of describe '#createSheet()'

  describe('#sheets()', function() {
    beforeEach(function() {
      return Factory('sheet').then(function(objs) {
        this.userA = objs.user;
        this.sheetA = objs.sheet;
        return Factory('sheet', {uid: this.userA._id}).then(function(sheetB) {
          this.sheetB = sheetB;
          return Factory('sheet'); // Add a sheet that's not userA's
        }.bind(this));
      }.bind(this))
    });

    it("returns an array of all sheets related to the user", function() {
      return this.userA.sheets().then(function(sheets) {
        expect(sheets.length).to.eql(2);
        expect(sheets[1]._id).to.eql(this.sheetA._id); // Might later throw error, not sure
        expect(sheets[0]._id).to.eql(this.sheetB._id); // how neo4j orders responses.
      }.bind(this));
    });
  }); // End of describe '#sheets()'

  describe('STATICS', function() {
    describe('#findById', function() {
      beforeEach(function() {
        return Factory('user').then(function(createdUser) {
          this.createdUser = createdUser;
          return User.findById(createdUser._id).then(function(foundUser) {
            this.foundUser = foundUser;
          }.bind(this))
        }.bind(this))
      });

      it("returns the searched for user object", function() {
        expect(this.createdUser._id).to.eql(this.foundUser._id);
        expect(this.createdUser.properties).to.eql(this.foundUser.properties);
      });

      it("returns an actual user object WITH the prototype methods", function() {
        expect(this.foundUser.sheets).not.to.be.undefined;
      });
    }); // End of describe '#findById'

    describe('#findAndUpdateOrCreate()', function() {
      context("when none is found", function() {
        it("creates a new user", function() {
          return User.findAndUpdateOrCreate({name: "Yann"})
          .then(function(user) {
            return db.query("MATCH (p:Person {name: {name}}) RETURN p", {name: "Yann"})
            .then(function(found) {
              expect(found.length).to.eql(1);
              expect(found[0].p.properties.name).to.eql(user.properties.name);
            });
          });
        });
      }); // End of context 'when none is found'

      context("when a user exists", function() {
        it("doesn't create a new user", function() {
          return User.findAndUpdateOrCreate({name: "Yann"}).then(function(firstUser) {
            return User.findAndUpdateOrCreate({name: "Yann"}).then(function(secondUser) {
              expect(firstUser._id).to.eql(secondUser._id);
            });
          });
        });
      }); // End of context 'when a user exists'

      describe('updateParams', function() {
        context("when no user yet exists", function() {
          it("persists those properties", function() {
            return User.findAndUpdateOrCreate({name: "theName"}, {age: 23, lastName: "lname"})
            .then(function(createdUser) {
              expect(createdUser.properties.age).to.eql(23);
              expect(createdUser.properties.lastName).to.eql("lname");
            });
          });
        }); // End of context 'when no user yes exists'

        context("when a user already existsd", function() {
          beforeEach(function() {
            return Factory('user', {provider_id: 12345});
          });

          it("persists those properties a", function() {
            return User.findAndUpdateOrCreate({provider_id: 12345}, {firstName: "lala"})
            .then(function(updatedUser) {
              expect(updatedUser.properties.firstName).to.eql("lala");
            });
          });
        }); // End of context 'when a user already existsd'
      }); // End of describe 'updateParams'
    }); // End of describe '#find()'
  }); // End of describe 'STATICS'
}); // End of describe 'User'
