var include          = require('include')
  , reqres           = require('reqres')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , sinon            = require('sinon')
  , Factory          = include('/test/util/factory')
  , middleware       = include('/middlewares/ensureAuthoredOrPublic')
chai.use(sinonChai);

describe('ensureAuthoredOrPublic', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  context("when targetSheet is public", function() {
    var next;
    beforeEach(function(done) {
      req.target_sheet = { properties: { public: true }};
      next = sinon.spy(done);
      middleware(req, res, next);
    });

    it("calls next (1)", function() {
      expect(next).to.have.been.called;
    });
  }); // End of context 'when targetSheet is public'

  context("when targetSheet is private", function() {
    beforeEach(function() {
      req.target_sheet = { properties: { public: false } };
    });

    context("when logged in user is author", function() {
      var next;
      beforeEach(function(done) {
        req.target_sheet_author = { _id: 123 };
        req.user = { _id: 123 };
        next = sinon.spy(done);
        middleware(req, res, next);
      });

      it("calls next (2)", function() {
        expect(next).to.have.been.called;
      });
    }); // End of context 'when logged in user is author'

    context("when logged in user isn't author", function() {
      var next;
      beforeEach(function(done) {
        req.target_sheet_author = { _id: 123 };
        req.user = { _id: 124 };
        next = sinon.spy();
        middleware(req, res, next);
        res.on('end', done);
      });

      it("doesn't call next", function() {
        expect(next).not.to.have.been.called;
      });

      it("resirects to the users sheets page", function() {
        expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
      });
    }); // End of context 'when logged in user isn't author'
  }); // End of context 'when targetSheet is private'
}); // End of describe 'ensureAuthoredOrPublic'
