var include   = require('include')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , reqres = require('reqres')
  , redirect  = include('/middlewares/errors/redirect')
chai.use(sinonChai);

describe('MIDDLEWARE|Redirect', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('sheets', function() {
    beforeEach(function() {
      redirect.sheets("Some error", req, res);
    });

    it("redirects the the logged in user's sheets page", function() {
      expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
    });
  }); // End of describe 'sheets'
}); // End of describe 'MIDDLEWARE|Redirect'
