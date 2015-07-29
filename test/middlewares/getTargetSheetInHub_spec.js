var include          = require('include')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , expect           = chai.expect
  , reqres           = require('reqres')
  , sinon            = require('sinon')
  , middleware       = include('/middlewares/hubs/getTargetSheetInHub')
  , Q                = require('q')
  , rejectionPromise = include('/test/util/rejectionPromise')
chai.use(sinonChai);

describe('MIDDLEWARE|getSheetInHub', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  context("when Hub.getSheet is succesful", function() {
    var getSheetStub, next;
    beforeEach(function(done) {
      getSheetStub = sinon.stub().returns(Q({dummySheet: true}));
      req.target_hub = {getSheet: getSheetStub};
      req.params = {sheet_id: 1234};
      next = sinon.spy(done);
      middleware(req, res, next);
    });

    it("calls target_hub.getSheet with the correct sheet_id", function() {
      expect(getSheetStub).to.have.been.calledWith(1234);
    });

    it("calls next", function() {
      expect(next).to.have.been.called;
    });

    it("stores the result as req.target_sheet_in_hub", function() {
      expect(req.target_sheet_in_hub).to.eql({dummySheet: true});
    });
  }); // End of context 'when Hub.getSheet is succesful'

  context("when Hub.getSheets fails", function() {
    var getSheetStub, next;
    beforeEach(function(done) {
      getSheetStub = sinon.stub().returns(rejectionPromise("THE ERROR"));
      req.target_hub = {getSheet: getSheetStub};
      req.params = {sheet_id: 1234};
      next = sinon.spy(done.bind(null, null));
      middleware(req, res, next);
    });

    it("calls next with the error message", function() {
      expect(next).to.have.been.calledWith("THE ERROR");
    });
  }); // End of context 'when Hub.getSheets fails'



}); // End of describe 'MIDDLEWARE|getTargetSheetInHub'
