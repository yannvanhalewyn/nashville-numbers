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

  describe('STATICS', function() {
    describe('#findById', function() {
      it("returns the searched for user object", function() {
        return Factory('user').then(function(createdUser) {
          return User.findById(createdUser._id).then(function(foundUser) {
            expect(createdUser._id).to.eql(foundUser._id);
            expect(createdUser.properties).to.eql(foundUser.properties);
          })
        })
      });
    }); // End of describe '#findById'
  }); // End of describe 'STATICS'
}); // End of describe 'User'
