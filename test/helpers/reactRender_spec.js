var include     = require('include')
  , chai        = require('chai')
  , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , sinon       = require('sinon')
  , React       = require('react')
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
 *
 * TODO a problem occurs when this test runs with the entire test suite,
 * specifically when before tests occur that have already required the helper
 * file because the when React.createFactory runs, that method wasn't stubbed
 * yet. Solve it!
 */

var stubbedReactFactory = sinon.stub().returns("Stubbed React Element");
sinon.stub(React, 'createFactory').returns(stubbedReactFactory);
var reactRender = include('/helpers/reactRender');

describe('reactRender', function() {
  describe('sheet', function() {
    var RESULT;
    beforeEach(function() {
      sinon.stub(React, "renderToString").returns("The Markup");
      target_sheet = {
        properties: {
          artist: "the artist", title: "the title", data: JSON.stringify(dummySheetData())
        }
      };
      RESULT = reactRender.sheet(target_sheet);
    });

    afterEach(function() {
      React.renderToString.restore();
    });

    it("generates a Sheet component with the denormalized data", function() {
      var denormalizedData = denormalize(dummySheetData());
      expect(stubbedReactFactory).to.have.been.calledWith({
        artist: "the artist", title: "the title", sheetData: denormalizedData
      });
    });

    it("renders the sheet component to string", function() {
      expect(React.renderToString).to.have.been.calledWith("Stubbed React Element");
    });

    it("returns the resulting markup", function() {
      expect(RESULT).to.eql("The Markup");
    });
  }); // End of describe 'renderSheet'
}); // End of describe 'reactRender'

React.createFactory.restore();

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
