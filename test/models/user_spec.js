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
  }); // End of describe 'STATICS'
}); // End of describe 'User'
