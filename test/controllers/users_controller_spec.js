var include    = require('include')
  , sinon      = require('sinon')
  , chai       = require('chai')
  , chaiThings = require('chai-things')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Controller = include('/controllers/users_controller')
  , User       = include('/models/user')
  , Factory    = include('/test/util/factory')
  , Q          = require('q')
  , _          = require('lodash')
chai.use(sinonChai);
chai.use(chaiThings);


describe('USERS_CONTROLLER', function() {

  var req, res;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('GET/index', function() {
    context("when search params are given", function() {
      beforeEach(function(done) {
        sinon.stub(User, "findByName").returns(Q(dummyUsers()));
        req.query = {search: "Foo"}
        Controller.index(req, res);
        res.on('end', done)
      });

      afterEach(function() {
        User.findByName.restore();
      });

      it("calls search on User", function() {
        expect(User.findByName).to.have.been.calledWith("Foo");
      });

      it("returns the users as json", function() {
        expect(res.json).to.have.been.calledWith(dummyUsers());
      });
    }); // End of context 'when search params are given'
  }); // End of describe 'GET/index'

  describe('GET/show', function() {
    context("when requested user page (id) is found", function() {
      beforeEach(function(done) {
        return Factory('user').then(function(userA) {
          return Factory('user').then(function(userB) {
            this.userA = userA;
            this.userB = userB;
            req.user = userA;
            req.target_user = userB;
            Controller.show(req, res);
            res.on('end', done)
          }.bind(this));
        }.bind(this));
      });

      it("renders the user template", function() {
        expect(res.render).to.have.been.calledWith('user');
      });

      it("sends the correct user data", function() {
        expected = JSON.stringify(this.userB);
        expect(res.render.lastCall.args).to.contain.an.item.with.property('state', expected);
      });
    }); // End of context 'when requested user page (id) is found'
  }); // End of describe 'GET#show'
}); // End of describe 'USER_CONTROLLER'

function dummyUsers() {
  return [
    {
      _id: 1,
      properties: {
        firstName: "John",
        lastName: "appleSeed"
      }
    },
    {
      _id: 2,
      properties: {
        firstName: "Foo",
        lastName: "Bar"
      }
    }
  ]
}
