var include          = require('include')
  , chai             = require('chai')
  , sinonChai        = require('sinon-chai')
  , sinon            = require('sinon')
  , expect           = chai.expect
  , reqres           = require('reqres')
  , Q                = require('q')
  , Controller       = include('/controllers/hubs/hub_sheets_controller')
  , rejectionPromise = include('/test/util/rejectionPromise')
  , reactRender      = include('/helpers/reactRender')
chai.use(sinonChai);

describe('HubSheetsController', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('GET/index', function() {
    var getSheetsStub;
    beforeEach(function(done) {
      getSheetsStub = sinon.stub().returns(Q(["a", "dummy", "array"]));
      req.target_hub = {getSheets: getSheetsStub}
      Controller.index(req, res);
      res.on('end', done)
    });

    it("calls target_hub.getSheets()", function() {
      expect(getSheetsStub).to.have.been.called;
    });

    it("sends along the resulting data via JSON", function() {
      expect(res.json).to.have.been.calledWith(["a", "dummy", "array"]);
    });
  }); // End of describe 'GET/index'

  describe('GET/show', function() {
    beforeEach(function() {
      sinon.stub(reactRender, 'sheet').returns("Markup");
      req.target_sheet_in_hub = {dummySheet: true};
      Controller.show(req, res);
    });

    afterEach(function() {
      reactRender.sheet.restore();
    });

    it("lets reactRender render the target sheet", function() {
      expect(reactRender.sheet).to.have.been.calledWith({dummySheet: true});
    });

    it("renders the sheet view template with rendered markup", function() {
      expect(res.render).to.have.been.calledWith("sheet", {markup: "Markup"});
    });
  }); // End of describe 'GET/show'

  describe('POST/create', function() {
    context("when addSheet is successful", function() {
      var addSheetStub;
      beforeEach(function(done) {
        addSheetStub = sinon.stub().returns(Q({sheet: {dummySheet: true}}));
        req.target_hub = {addSheet: addSheetStub}
        req.body = {sheet_id: 123};
        Controller.create(req, res);
        res.on('end', done)
      });

      it("calls target_hub.addSheet with the target_sheet's id", function() {
        expect(addSheetStub).to.have.been.calledWith(123);
      });

      it("returns the results sheet property via json", function() {
        expect(res.json).to.have.been.calledWith({dummySheet: true});
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

  describe('DELETE/destroy', function() {
    context("when hub.removeSheet is successful", function() {
      var removeSheetStub
      beforeEach(function(done) {
        removeSheetStub = sinon.stub().returns(Q());
        req.target_hub = {removeSheet: removeSheetStub}
        req.params = {sheet_id: 123};
        Controller.destroy(req, res);
        res.on('end', done)
      });

      it("calls removeSheet on the target_hub with the sheet_id params", function() {
        expect(req.target_hub.removeSheet).to.have.been.calledWith(123);
      });

      it("responds with a destroyed: true flag as json", function() {
        expect(res.json).to.have.been.calledWith({destroyed: true});
      });
    }); // End of context 'when hub.removeSheet is successful'

    context("when hub.removesheet fails", function() {
      var removeSheetStub
      beforeEach(function(done) {
        removeSheetStub = sinon.stub().returns(rejectionPromise("Some Error"));
        req.target_hub = {removeSheet: removeSheetStub}
        req.params = {sheet_id: 123};
        Controller.destroy(req, res);
        res.on('end', done)
      });

      it("sends a status of 400 with the error message", function() {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith("Some Error");
      });
    }); // End of context 'when hub.removesheet fails'
  }); // End of describe 'DELETE/destroy'
}); // End of describe 'HubSheetsController'
