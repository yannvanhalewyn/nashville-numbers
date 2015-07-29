var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , sinon      = require('sinon')
  , reqres     = require('reqres')
  , Q          = require('q')
  , User       = include('/models/user')
  , Factory    = include('/test/util/factory')
  , Controller = include('/controllers/user_sheets_controller')
chai.use(sinonChai);

describe('userSheetsController', function() {
  var req, res, dummySheets;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    dummySheets = ["an", "array", "of", "sheets"]
    req.target_user_sheets = dummySheets;
  });

  describe('index', function() {
    it("sends the dummy sheets as json", function() {
      Controller.index(req, res);
      expect(res.json).to.have.been.calledWith(dummySheets);
    });
  }); // End of describe 'index'

  describe('indexMe', function() {
    context("when the request is not via xhr", function() {
      beforeEach(function() {
        Controller.indexMe(req, res);
      });

      it("renders the sheets template", function() {
        expect(res.render).to.have.been.calledWith("sheets");
      });

      it("sends along sheets and sets the active_tab value", function() {
        expect(res.render).to.have.been.calledWith("sheets", {
          active_sheets: true, sheets: dummySheets
        });
      });
    }); // End of context 'when the request is not via xhr'

    context("when the request is xhr", function() {
      beforeEach(function() {
        req.xhr = true;
        Controller.indexMe(req, res);
      });

      it("sends the target_user_sheets as JSON", function() {
        expect(res.json).to.have.been.calledWith(dummySheets);
      });
    }); // End of context 'when the request is xhr'
  }); // End of describe 'indexMe'
}); // End of describe 'userSheetsController'
