var include          = require('include')
  , reqres           = require('reqres')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , sinon            = require('sinon')
  , Factory          = include('/test/util/factory')
  , middleware       = include('/middlewares/sheets/ensureAuthoredOrPublic')
chai.use(sinonChai);

describe('ensureAuthoredOrPublic', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  context("when targetSheet is public", function() {
    it("calls next (1)", function() {
      req.target_sheet = { properties: { public: true }};
      var next = sinon.spy();
      middleware(req, res, next);
      expect(next).to.have.been.called;
    });
  }); // End of context 'when targetSheet is public'

  context("when targetSheet is private", function() {
    beforeEach(function() {
      req.target_sheet = { properties: { public: false } };
    });

    context("when logged in user is author", function() {
      it("calls next (2)", function() {
        req.target_sheet_author = { _id: 123 };
        req.user = { _id: 123 };
        var next = sinon.spy();
        middleware(req, res, next);
        expect(next).to.have.been.called;
      });
    }); // End of context 'when logged in user is author'

    context("when logged in user isn't author", function() {
      it("calls next with an error message", function() {
        req.target_sheet_author = { _id: 123 };
        req.user = { _id: 124 };
        var next = sinon.spy();
        middleware(req, res, next);
        expect(next).to.have.been.calledWith("You have no right to visit this sheet.");
      });
    }); // End of context 'when logged in user isn't author'
  }); // End of context 'when targetSheet is private'
}); // End of describe 'ensureAuthoredOrPublic'
