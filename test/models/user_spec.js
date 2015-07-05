var util = require('../util');

var User     = require('../../models/user');
var Sheet    = require('../../models/sheet');
var expect   = require('chai').expect;
var Q        = require('q');
var _        = require('lodash');

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
        .then(function(data) { done("Should not get called here") },
              function(err) { done()  });
      });
    })
  });

  var validUserParams = {firstName: "Yann", provider_id: '1', provider: 'facebook'};

  describe ('#sheets', function() {
    var USER;
    var SHEETS;

    beforeEach(function(done) {
      User.create(validUserParams)
      .then(function(user) {
        USER = user;
        Q.all([
          Sheet.create({title: "song1", authorID: user._id}),
          Sheet.create({title: "song2", authorID: user._id}),
          Sheet.create({title: "song3", authorID: user._id})
        ]).then(function(sheets) {
          SHEETS = sheets;
          done();
        }, console.error)
      });
    });
    it('returns the array of sheets', function() {
      return USER.sheets.then(function(result) {
        var foundSheets = result.map(function(s) {
          return _.pick(s, ['title', 'authorID']);
        });
        var targetSheets = SHEETS.map(function(s) {
          return _.pick(s, ['title', 'authorID']);
        });
        expect(foundSheets).to.eql(targetSheets);
      });
    });
  });

  describe ('#createSheet()', function() {
    var USER;
    var SHEET;

    beforeEach(function(done) {
      User.create(validUserParams)
      .then(function(user) {
        USER = user;
        user.createSheet({title: "FOOBAR"})
        .then(function(newSheet) {
          SHEET = newSheet;
          done()
        }, done);
      });
    });

    it('creates a new sheet', function() {
      return Sheet.count().then(function(count) {
        expect(count).to.eql(1);
      })
    });

    it('adds the correct authorID', function() {
      expect(SHEET.authorID).to.eql(USER._id);
    });

    it('sets the params', function() {
      expect(SHEET.title).to.eql("FOOBAR");
    });
  });
});
