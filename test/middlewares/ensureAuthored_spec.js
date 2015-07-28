var include          = require('include')
  , reqres           = require('reqres')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , sinon            = require('sinon')
  , Factory          = include('/test/util/factory')
  , middleware       = include('/middlewares/sheets/ensureAuthored')
chai.use(sinonChai);

describe('ensureAuthoredOrPublic', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    req.user = { _id: 123 }
  });

  context("when targetSheet is was authored by logged in user", function() {
    it("calls next", function() {
      req.target_sheet_author = { _id: 123 };
      var next = sinon.spy();
      middleware(req, res, next);
      expect(next).to.have.been.called;
    });
  }); // End of context 'when targetSheet is public'

  context("when targetSheet was not authored", function() {
    var next;
    beforeEach(function(done) {
      req.target_sheet_author = { _id: 124 };
      next = sinon.spy();
      middleware(req, res, next);
      res.on('end', done);
    });

    it("doesn't call next", function() {
      expect(next).not.to.have.been.called;
    });

    it("resirects to the logged in user's sheets page", function() {
      expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
    });
  }); // End of context 'when targetSheet is private'
}); // End of describe 'ensureAuthoredOrPublic'
