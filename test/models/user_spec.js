var include = require('include')
  , expect  = require('chai').expect
  , User    = include('/models/user')

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
        expect(user.id).to.be.above(0);
        expect(user.firstName).to.eql("Yann");
        expect(user.lastName).to.eql("Vanhalewyn");
      });
    });
  }); // End of context 'instantiation'
}); // End of describe 'User'
