var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , sinon      = require('sinon')
  , Factory    = include('/test/util/factory')
  , middleware = include('/middlewares/users/getTargetUsersSheets')
  , Q          = require('q')
chai.use(sinonChai);

describe('MIDDLEWARE|getTargetUsersSheets', function() {

  var req, res, next;

  beforeEach(function(done) {
    req = reqres.req();
    res = reqres.res();
    next = sinon.spy(done);
    return Factory('user').then(function(user) {
      sinon.stub(user, 'sheets').returns(Q(["a", "dummy", "array"]));
      req.target_user = user;
      middleware(req, res, next);
    });
  });

  it("calls next", function() {
    expect(next).to.have.been.called;
  });

  it("calls the target_users sheets method", function() {
    expect(req.target_user.sheets).to.have.been.called;
  });

  it("stores the response in req.target_user_sheets", function() {
    expect(req.target_user_sheets).to.eql(["a", "dummy", "array"]);
  });
}); // End of describe 'MIDDLEWARE|getTargetUsersSheets'
