var include = require('include')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , reqres = require('reqres')
  , Controller = include('/controllers/sheets_controller')
chai.use(sinonChai);

describe('SheetsController', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('GET/edit', function() {
    beforeEach(function() {
      req.target_sheet = {dummySheet: true};
      Controller.edit(req, res);
    });

    it("renders the sheetEditor template", function() {
      expect(res.render).to.have.been.calledWith("sheetEditor");
    });

    it("sends along the data as JSON and sets the active_sheets flag", function() {
      expect(res.render).to.have.been.calledWith("sheetEditor", {
        active_sheets: true, state: JSON.stringify({dummySheet: true})
      });
    });
  }); // End of describe 'GET/edit'
}); // End of describe 'SheetsController'
