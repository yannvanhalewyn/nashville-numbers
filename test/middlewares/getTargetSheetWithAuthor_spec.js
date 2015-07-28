var include          = require('include')
  , reqres           = require('reqres')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , sinon            = require('sinon')
  , Factory          = include('/test/util/factory')
  , middleware       = include('/middlewares/sheets/getTargetSheetWithAuthor')
  , Sheet            = include('/models/sheet')
  , Q                = require('q')
  , rejectionPromise = include('/test/util/rejectionPromise')
chai.use(sinonChai);

describe('getTargetSheetWithAuthor', function() {
  var req, res, next;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    req.params = {sheet_id: 1234};
  });

  context("when Sheet.findByIdWithAuthor returns something", function() {
    beforeEach(function(done) {
      sinon.stub(Sheet, 'findByIdWithAuthor').returns(dummyResolve());
      next = sinon.spy(done);
      middleware(req, res, next);
    });

    afterEach(function() {
      Sheet.findByIdWithAuthor.restore();
    });

    it("calls Sheet.findByIdWithAuthor with the sheet_id param", function() {
      expect(Sheet.findByIdWithAuthor).to.have.been.calledWith(1234);
    });

    it("stores the replied sheet as req.target_sheet", function() {
      expect(req.target_sheet).to.eql({dummySheet: true});
    });

    it("stores the replied author as req.target_sheet_author", function() {
      expect(req.target_sheet_author).to.eql({dummyAuthor: true});
    });
  }); // End of context 'when Sheet.findByIdWithAuthor returns something'

  context("when Sheet.findByIdWithAuthor throws (eg no sheet was found)", function() {
    beforeEach(function(done) {
      sinon.stub(Sheet, 'findByIdWithAuthor').returns(rejectionPromise("THE ERROR"));
      next = sinon.spy();
      middleware(req, res, next);
      res.on('end', done);
    });

    afterEach(function() {
      Sheet.findByIdWithAuthor.restore();
    });

    it("doesn't call next", function() {
      expect(next).not.to.have.been.called;
    });

    it("redirects to /sheets", function() {
      expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
    });
  }); // End of context 'when Sheet.findByIdWithAuthor throws (eg no sheet was found)'
}); // End of describe 'getTargetSheetWithAuthor'

function dummyResolve() {
  return Q({
    sheet: {dummySheet: true},
    author: {dummyAuthor: true}
  });
}
