var include   = require('include')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , router    = include('/routes/friends')
  , reqres    = require('reqres')
  , Factory   = include('/test/util/factory')
  , User      = include('/models/user')
  , _         = require('lodash')

// Setup
chai.use(sinonChai);
include('/test/util/mock_db')

// The tests
describe('GET /friends', function() {

  beforeEach(function() {
    this.params = {
      url: '/friends',
      isAuthenticated: function() {return false;}
    }
    this.res = reqres.res();
  });

  context("when valid user is logged in", function() {
    beforeEach(function() {
      return Factory.createList('User', 2)
      .then(function(users) {
        this.userA = users[0];
        this.userB = users[1];
        login(this.userA, this.params);
        return this.userA.addFriend(this.userB._id);
      }.bind(this));
    });

    it("renders the friends page", function(done) {
      router(reqres.req(this.params), this.res);
      this.res.on('end', function() {
        expect(this.res.render).to.have.been.calledWith('friends');
        done();
      }.bind(this));
    });

    it("renders the logged in user's friendslist", function(done) {
      router(reqres.req(this.params), this.res);
      this.res.on('end', function() {
        var friendsList = this.res.render.args[0][1].friends;
        expect(friendsList.length).to.eql(1);
        expect(friendsList[0]._id).to.eql(this.userB._id);
        done();
      }.bind(this))
    });
  }); // End of context 'when valid user is logged in'

  context("when no user logged in", function() {
    it("redirects to /home", function(done) {
      req = reqres.req(this.params)
      res = reqres.res();
      router(req, res);
      res.on('end', function() {
        expect(res.redirect).to.have.been.calledWith('/home');
        done();
      })
    });
  }); // End of context 'when no user logged in'
}); // End of describe 'GET /friends'

function login(user, params) {
  params.isAuthenticated = function() {
    return true;
  }
  params.user = user;
}
