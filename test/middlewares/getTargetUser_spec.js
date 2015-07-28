var include       = require('include')
  , chai          = require('chai')
  , sinonChai     = require('sinon-chai')
  , expect        = chai.expect
  , reqres        = require('reqres')
  , sinon         = require('sinon')
  , Factory       = include('/test/util/factory')
  , getTargetUser = include('/middlewares/users/getTargetUser')
  , User          = include('/models/user')
  , Q             = require('q')
chai.use(sinonChai);

describe('MIDDLEWARE|getTargetUser', function() {

  var req, res, next;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    next = sinon.spy();
  });

  context("when existing user_id has been given", function() {
    beforeEach(function() {
      return Factory('user').then(function(user) {
        this.user = user;
        req.params.user_id = user._id.toString();
        sinon.stub(User, 'findById').returns(Q(user));
        return getTargetUser(req, res, next);
      }.bind(this));
    });

    afterEach(function() {
      User.findById.restore();
    });

    it("calls next", function() {
      expect(next).to.have.been.called;
    });

    it("calls user.findById with the correct ID", function() {
      expect(User.findById).to.have.been.calledWith(this.user._id.toString());
    });

    it("sets the req.target_user property", function() {
      expect(req.target_user).to.eql(this.user);
    });
  }); // End of context 'when existing user_id has been given'

  context("when no existing userID has been requested", function() {
    beforeEach(function() {
      req.params.user_id = "999"; // invalid
      return getTargetUser(req, res, next);
    });

    it("redirects to root", function() {
      expect(res.redirect).to.have.been.calledWith('/');
    });
  }); // End of context 'when no existing userID has been requested'

}); // End of describe 'MIDDLEWARE|getTargetUser'
