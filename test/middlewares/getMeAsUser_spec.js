var include     = require('include')
  , chai        = require('chai')
  , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , reqres      = require('reqres')
  , sinon       = require('sinon')
  , Factory     = include('/test/util/factory')
  , getMeAsUser = include('/middlewares/users/getMeAsUser')
chai.use(sinonChai);

describe('MIDDLEWARE|getMeAsUser', function() {

  var req, res, next;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    next = sinon.spy();
    return Factory('user').then(function(user) {
      this.user = user;
      req.user = user;
      getMeAsUser(req, res, next);
    }.bind(this));
  });

  it("calls next", function() {
    expect(next).to.have.been.called;
  });

  it("stores the logged-in user as req.target_user", function() {
    expect(req.target_user).to.eql(this.user)
  });


}); // End of describe 'MIDDLEWARE|getMeAsUser'
