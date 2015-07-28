var include          = require('include')
  , reqres           = require('reqres')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , sinon            = require('sinon')
  , Factory          = include('/test/util/factory')
  , middleware       = include('/middlewares/sheets/ensureAuthored')
chai.use(sinonChai);

describe('MIDDLEWARE|ensureAuthored', function() {
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
    it("calls next with an error message", function() {
      req.target_sheet_author = { _id: 124 };
      next = sinon.spy();
      middleware(req, res, next);
      expect(next).to.have.been.calledWith("You are not the author.");
    });
  }); // End of context 'when targetSheet is private'
}); // End of describe 'ensureAuthoredOrPublic'
