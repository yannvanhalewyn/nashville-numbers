var include    = require('include')
  , sinon      = require('sinon')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Controller = include('/controllers/users_controller')
  , User       = include('/models/user')
  , Q          = require('q')
chai.use(sinonChai);


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
  }); // End of describe '#index'
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
