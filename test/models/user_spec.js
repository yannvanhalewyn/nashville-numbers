process.env.NODE_ENV = 'test';

var User     = require('../../models/user');
var expect   = require('chai').expect;
var mongoose = require('mongoose');
var config   = require('../../config');
mongoose.connect(config.db_url);

beforeEach(function() {
});
afterEach(function(done) {
  User.remove({}, done);
});

var authData = {provider_id: "123", provider: "facebook", firstName: "Claudius"};
var authData2 = {provider_id: "123", provider: "facebook", firstName: "Cesar"};

describe("User", function() {
  describe ("#registerFacebookuser()", function() {
    context("if no user existing user found", function() {
      it ("creates a new user ", function() {
        return User.registerFacebookUser(authData)
        .then(function() {return User.count();})
        .then(function(count) { expect(count).to.eql(1); })
      });

      it ("returns a promise for the new user", function() {
        return User.registerFacebookUser(authData)
        .then(function(promisedUser) {
          expect(promisedUser.firstName).to.eql("Claudius");
          expect(promisedUser.provider_id).to.eql(authData.provider_id);
        })
      });
    });

    context("when a user already existed with the supllied provider_id", function() {
      it ("doesn't create a new user", function() {
        return User.create(authData)
        .then(function() {return User.registerFacebookUser(authData)})
        .then(function() {return User.count();})
        .then(function(count) {expect(count).to.eql(1); })
      });

      // NOTE: This thing is weird, lost 2 hours trying to figure it out.
      // Try removing 'if(result) return result' bit in user code
      it ("returns a promise for the existing user", function(done) {
        User.create(authData, function() {
          User.findOne(authData).exec().then(function(data) {
            var originalID = data._id;
            User.registerFacebookUser(authData2)
            .then(function(promisedUser){
              expect(promisedUser._id).to.eql(originalID);
              done();
            })
          });
        });
      });
    });

    context("when given data is invalid", function() {
      it('resolves in the error promise', function(done) {
        return User.registerFacebookUser({foo: 'bar'})
        .then(function(data) { done("Should not get called here") })
        .catch(function(err) {
          done();
        });
      });
    })
  });
});
