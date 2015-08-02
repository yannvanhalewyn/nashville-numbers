var include    = require('include')
  , chaiThings = require('chai-things')
  , chai       = require('chai')
  , User       = include('/models/user')
  , Factory    = include('/test/util/factory')
  , db         = include('/config/db')
  , expect     = chai.expect
chai.use(chaiThings)

include('/test/util/clear_db');

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

    it("returns an instace of User", function() {
      return User.create(this.validParams).then(function(user) {
        expect(user).to.be.an.instanceof(User);
      })
    });
  }); // End of context 'instantiation'

  describe('#createSheet()', function() {
    beforeEach(function() {
      return Factory('user').then(function(user) {
        this.user = user;
        return user.createSheet({title: "theTitle", artist: "theArtist", visibility: "private"})
        .then(function(sheet) {
          this.sheet = sheet;
        }.bind(this))
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

    it("returns a sheet object", function() {
      expect(this.sheet).to.be.an.instanceof(include('/models/sheet'));
    });

    context("with missing params", function() {
      it("sets those params to the default", function() {
        return this.user.createSheet({}).then(function(sheet) {
          expect(sheet.properties.title).to.eql("title");
          expect(sheet.properties.artist).to.eql("artist");
        });
      });
    }); // End of context 'with missing params'
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
    describe('.findByName()', function() {
      beforeEach(function() {
        return Factory('user', {firstName: "John", lastName: "Appleseed"}).then(function(JA) {
          return Factory('user', {firstName: "Johnathan", lastName: "Glee"}).then(function(JG) {
            return Factory('user', {firstName: "Fred", lastName: "Gleese"}).then(function(FG) {
              this.JA = JA;
              this.JG = JG;
              this.FG = FG;
            }.bind(this))
          }.bind(this))
        }.bind(this));
      });

      context("When the search param is part of the firstName of multiple users", function() {
        it("finds all those users (1)", function() {
          return User.findByName("john").then(function(result) {
            expect(result.length).to.eql(2);
            expect(result).to.contain.an.item.with.property('_id', this.JA._id);
            expect(result).to.contain.an.item.with.property('_id', this.JG._id);
          }.bind(this))
        });
      }); // End of context 'When the search param is part of the firstName of multiple users'

      context("when the search param is part of the lastName of multiple users", function() {
        it("finds all those users (2)", function() {
          return User.findByName("lEe").then(function(result) {
            expect(result.length).to.eql(2);
            expect(result).to.contain.an.item.with.property('_id', this.JG._id);
            expect(result).to.contain.an.item.with.property('_id', this.FG._id);
          }.bind(this))
        });
      }); // End of context 'when the search param is part of the lastName of multiple users'

      context("when the search param contains a part of firstName/lastName", function() {
        it("finds that user", function() {
          return User.findByName("ohN Lee").then(function(result) {
            expect(result.length).to.eql(1);
            expect(result).to.contain.an.item.with.property('_id', this.JG._id);
          }.bind(this))
        });
      }); // End of context 'when the search param contains a part of firstName/lastName'
    }); // End of describe '.find()'

    describe('.findById', function() {
      context("When existing userID is provided", function() {
        beforeEach(function() {
          return Factory('user').then(function(createdUser) {
            this.createdUser = createdUser;
            return User.findById(createdUser._id.toString()).then(function(foundUser) {
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
          expect(this.foundUser).to.be.an.instanceof(User);
        });
      }); // End of context 'When existing userID is provided'

      context("When user does not exist", function() {
        it("throws a 'userNotFound' error", function(done) {
          User.findById("999").then(done, function(err) {
            expect(err).to.eql("Could not find user with id 999");
            done();
          });
        });
      }); // End of context 'When user does not exist'
    }); // End of describe '.findById'

    describe('.findAndUpdateOrCreate()', function() {
      it("returns an instance of User", function() {
        return User.findAndUpdateOrCreate({name: "Yann"}).then(function(user) {
          expect(user).to.be.an.instanceof(User);
        });
      });

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
    }); // End of describe '.find()'
  }); // End of describe 'STATICS'
}); // End of describe 'User'
