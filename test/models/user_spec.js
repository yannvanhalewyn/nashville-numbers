var include = require('include');
var expect  = require('chai').expect;
var Q       = require('q');
var _       = require('lodash');
var util    = include('/test/util/mock_db');
var User    = include('/models/user');
var Sheet   = include('/models/sheet');
var build   = include('/test/util/factory')

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

    beforeEach(function() {
      return User.create(validUserParams)
      .then(function(user) {
        this.user = user;
        return Q.all([
          Sheet.create({title: "song1", authorID: user._id}),
          Sheet.create({title: "song2", authorID: user._id}),
          Sheet.create({title: "song3", authorID: user._id})
        ]).then(function(sheets) {
          this.sheets = sheets;
        }.bind(this), console.error)
      }.bind(this));
    });

    it('returns the array of sheets', function() {
      return this.user.sheets.then(function(result) {
        var foundSheets = result.map(function(s) {
          return _.pick(s, ['title', 'authorID']);
        });
        var targetSheets = this.sheets.map(function(s) {
          return _.pick(s, ['title', 'authorID']);
        });
        expect(foundSheets).to.eql(targetSheets);
      }.bind(this));
    });
  });

  describe ('#createSheet()', function() {
    var USER;
    var SHEET;

    beforeEach(function() {
      return build('user')
      .then(function(user) {
        this.user = user;
        return user.createSheet({title: "FOOBAR"})
        .then(function(sheet) {
          this.sheet = sheet;
        }.bind(this))
      }.bind(this))
    });

    it('creates a new sheet', function() {
      return Sheet.count().then(function(count) {
        expect(count).to.eql(1);
      })
    });

    it('adds the correct authorID', function() {
      expect(this.sheet.authorID).to.eql(this.user._id);
    });

    it('sets the params', function() {
      expect(this.sheet.title).to.eql("FOOBAR");
    });
  });

  describe('friends', function() {
    beforeEach(function() {
      return build('user')
      .then(function(userA) {
        this.userA = userA;
        return build('user')
        .then(function(userB) {
          this.userB = userB;
        }.bind(this));
      }.bind(this));
    });

    describe('#addFriend()', function() {
      context("when supplied friend id is a valid user", function() {
        beforeEach(function() {
          this.userA.addFriend(this.userB._id);
        });

        it("adds that id to the friends list", function() {
          expect(this.userA.friend_ids.length).to.eql(1);
          expect(this.userA.friend_ids[0]).to.equal(this.userB._id);
        });

        context("when userA already has userB as a friend", function() {
          it("doesn't duplicate the entry", function() {
            this.userA.addFriend(this.userB._id);
            expect(this.userA.friend_ids.length).to.eql(1);
          });
        }); // End of context 'when userA already has userB as a friend'
      }); // End of context 'when supplied friend id is a valid user'

      context("when supplied friendID is not a valid Mongo id", function() {
        it("doesn't add it", function() {
          this.userA.addFriend("invalid");
          expect(this.userA.friend_ids.length).to.eql(0);
        });
      }); // End of context 'when supplied friendID is not a valid Mongo id'
    }); // End of describe '#addFriend()'

    describe('#removeFriend', function() {
      it("removes the friendID", function() {
        this.userA.addFriend(this.userB._id);
        this.userA.removeFriend(this.userB._id);
        expect(this.userA.friend_ids.length).to.eql(0);
      });
    }); // End of describe '#removeFriend'
  }); // End of describe 'friends'
});
