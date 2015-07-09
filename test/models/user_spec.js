var include = require('include')
  , expect  = require('chai').expect
  , User    = include('/models/user')
  , Factory = include('/test/util/factory')

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
      return new User(this.validParams)
      .then(function(user) {
        expect(user._id).to.be.above(0);
        expect(user.properties.firstName).to.eql("Yann");
        expect(user.properties.lastName).to.eql("Vanhalewyn");
      });
    });
  }); // End of context 'instantiation'

  describe('STATICS', function() {
    describe('#findById', function() {
      it("returns the searched for user object", function() {
        return Factory('user').then(function(createdUser) {
          return User.findById(createdUser._id).then(function(foundUser) {
            expect(createdUser).to.eql(foundUser);
          })
        })
      });
    }); // End of describe '#findById'
  }); // End of describe 'STATICS'
}); // End of describe 'User'
