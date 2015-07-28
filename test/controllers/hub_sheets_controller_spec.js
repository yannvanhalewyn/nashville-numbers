var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , sinon      = require('sinon')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Q          = require('q')
  , Controller = include('/controllers/hubs/hub_sheets_controller')
  , rejectionPromise = include('/test/util/rejectionPromise')
chai.use(sinonChai);

describe('HubSheetsController', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('POST/create', function() {
    context("when addSheet is successful", function() {
      var addSheetStub;
      beforeEach(function(done) {
        addSheetStub = sinon.stub().returns(Q({dummy: true}));
        req.target_hub = {addSheet: addSheetStub}
        req.body = {sheet_id: 123};
        Controller.create(req, res);
        res.on('end', done)
      });

      it("calls target_hub.addSheet with the target_sheet's id", function() {
        expect(addSheetStub).to.have.been.calledWith(123);
      });

      it("returns the created relationship via JSON", function() {
        expect(res.json).to.have.been.calledWith({dummy: true});
      });
    }); // End of context 'when addSheet is successful'

    context("when addSheet throws", function() {
      var addSheetStub;
      beforeEach(function(done) {
        addSheetStub = sinon.stub().returns(rejectionPromise("The error"));
        req.target_hub = {addSheet: addSheetStub}
        Controller.create(req, res);
        res.on('end', done)
      });

      it("sends a 400 with the error message", function() {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith("The error");
      });
    }); // End of context 'when addSheet throws'
  }); // End of describe 'POST/create'
}); // End of describe 'HubSheetsController'
