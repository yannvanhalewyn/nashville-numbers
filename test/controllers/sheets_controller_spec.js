var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , sinon      = require('sinon')
  , Q          = require('q')
  , Controller = include('/controllers/sheets_controller')
  , Factory    = include('/test/util/factory')
chai.use(sinonChai);

describe('SheetsController', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('GET/show', function() {
    beforeEach(function() {
      req.target_sheet = {properties: {data: {dummyData: true}}};
      Controller.show(req, res);
    });

    it("renders the sheet template", function() {
      expect(res.render).to.have.been.calledWith("sheet");
    });

    it("sends along the sheet data and sets the active_sheets flag", function() {
      expect(res.render).to.have.been.calledWith("sheet", {
        active_sheets: true, data: {dummyData: true}
      });
    });
  }); // End of describe 'GET/show'

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

  describe('POST/create', function() {
    var USER;
    beforeEach(function() {
      return Factory('user').then(function(user) {
        USER = user;
        sinon.stub(user, 'createSheet').returns(Q({_id: 1234}));
        req.user = user;
      });
    });

    context("when a public flag is given", function() {
      beforeEach(function(done) {
        req.body = {dummyBody: true, public: 'on'};
        Controller.create(req, res);
        res.on('end', done);
      });

      it("sets the flag to 'true' and calls createSheet on user", function() {
        expect(USER.createSheet).to.have.been.calledWith({dummyBody: true, public: true});
      });
    }); // End of context 'when a public flag is given'

    context("wen a public flag isn't given", function() {
      beforeEach(function(done) {
        req.body = {dummyBody: true};
        Controller.create(req, res);
        res.on('end', done);
      });

      it("sets the public flag to false and calls createSheet on user", function() {
        expect(USER.createSheet).to.have.been.calledWith({dummyBody: true, public: false});
      });

      it("redirects to the edit page of the new sheet", function() {
        expect(res.redirect).to.have.been.calledWith("/sheets/1234/edit");
      });
    }); // End of context 'wen a public flag isn't given'
  }); // End of describe 'POST/create'

  describe('PUT/update', function() {
    var SHEET;
    beforeEach(function(done) {
      return Factory('sheet').then(function(entities) {
        SHEET = entities.sheet;
        sinon.stub(SHEET, 'update').returns(Q({dummySheet: true}));
        req.target_sheet = SHEET;
        req.body = dummySheetData();
        Controller.update(req, res);
        res.on('end', done);
      });
    });

    it("calls target_sheet.update with the stringified data and sets the title and artist attributes", function() {
      var data = dummySheetData();
      expect(SHEET.update).to.have.been.calledWith({
        title: data.main.title,
        artist: data.main.artist,
        data: JSON.stringify(dummySheetData())
      });
    });

    it("sends along the updated (resulting) data as json", function() {
      expect(res.json).to.have.been.calledWith({dummySheet: true});
    });
  }); // End of describe 'PUT/update'

  describe('DELETE/destroy', function() {
    var SHEET;
    beforeEach(function() {
      return Factory('sheet').then(function(entities) {
        SHEET = entities.sheet;
        sinon.stub(SHEET, 'destroy').returns(Q());
        req.target_sheet = SHEET;
        Controller.destroy(req, res);
      });
    });

    it("calls destroy on target_sheet", function() {
      expect(SHEET.destroy).to.have.been.called;
    });

    // TODO this should change when front-end editor uses backbone as model.
    it("redirects to the user's sheets page", function() {
      expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
    });
  }); // End of describe 'DELETE/destroy'
}); // End of describe 'SheetsController'

function dummySheetData() {
  return {
    main: {
      title: "The Title",
      artist: "The Artist",
      sections: [1, 2, 3]
    }
  }
}
