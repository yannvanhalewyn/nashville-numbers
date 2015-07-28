var include     = require('include')
  , chai        = require('chai')
  , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , reqres      = require('reqres')
  , sinon       = require('sinon')
  , Q           = require('q')
  , React       = require('react')
  , Factory     = include('/test/util/factory')
  , denormalize = include('/app/helpers/denormalize')
chai.use(sinonChai);

/*
 * Stub out some react methods for testing. This is some complicated stub
 * nesting, I'm looking for a better solution. This is what's going on:
 *
 * - When the controller LOADS, it calls React.createFactory on the
 *   sheetComponent (ReactClass). I stub this call out to return a stubbed react
 *   factory.
 *
 * - On render time, this factory will be called with the data for the props to
 *   return a reactElement with the props in place, ready to be rendered.
 *   Calling the stubbed factory will just return a string for testing
 *   purpouses, and thanks to sinon I can check if the stubbed factory was
 *   called with the correct prop data.
 *
 * - Lastly React.renderToString is called with that element as argument. This
 *   gets stubbed out during the test to return some dummy markup.
 *
 * We need to stub all this out before require the controller, because
 * React.createFactory is called at 'require' time. I would love to stub this in
 * the test itself.
 */

var stubbedReactFactory = sinon.stub().returns("Stubbed React Element");
sinon.stub(React, 'createFactory').returns(stubbedReactFactory);
var Controller  = include('/controllers/sheets_controller')

describe('SheetsController', function() {
  var req, res;
  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
  });

  describe('GET/show', function() {
    beforeEach(function() {
      sinon.stub(React, "renderToString").returns("The Markup");
      req.target_sheet = {properties: {data: JSON.stringify(dummySheetData())}};
      Controller.show(req, res);
    });

    afterEach(function() {
      React.renderToString.restore();
    });

    it("generates a Sheet component with the denormalized data", function() {
      var denormalizedData = denormalize(dummySheetData());
      expect(stubbedReactFactory).to.have.been.calledWith({sheetData: denormalizedData});
    });

    it("renders the sheet component to string", function() {
      expect(React.renderToString).to.have.been.calledWith("Stubbed React Element");
    });

    it("renders the sheet template with the outputed markup", function() {
      expect(res.render).to.have.been.calledWith("sheet", {markup: "The Markup"});
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
      sections: ["section1"]
    },
    sections: {
      "section1": {
        id: "section1",
        rows: []
      }
    }
  }
}
