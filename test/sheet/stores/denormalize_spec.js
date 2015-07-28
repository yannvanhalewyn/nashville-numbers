var include     = require('include');
var expect      = require('chai').expect;
var Immutable   = require('immutable');
var denormalize = include('/app/sheetEditor/stores/denormalize');

describe('#denormalize()', function() {
  context("when there are no missing fields", function() {
    it('hands back the expected data', function() {
      expect(denormalize(_normalizedData())).to.eql(_deNormalizedData());
    });
  }); // End of context 'when there are no missing fields'

  context("when a bar has no chords property", function() {
    it("doesnt throw an error", function() {
      var input = _normalizedWithMissingChordsArrayInBar();
      expect(denormalize.bind(this, input)).not.to.throw();
    });
  }); // End of context 'when a bar has no chords property'

  context("when a row has no bars property", function() {
    it("doesn't throw an error", function() {
      var input = _normalizedWithMissingBarsArrayInRow();
      expect(denormalize.bind(this, input)).not.to.throw();
    });
  }); // End of context 'when a row has no bars property'

  context("when a section has no rows property", function() {
    it("doesn't throw an error", function() {
      var input = _normalizedWithMissingRowsArrayInSection();
      expect(denormalize.bind(this, input)).not.to.throw();
    });
  }); // End of context 'when a section has no rows property'

  context("when the sheet has no sections", function() {
    it("doesn't throw an error", function() {
      var input = _normalizedWithMissingSectionsInMain();
      expect(denormalize.bind(this, input)).not.to.throw();
    });
  }); // End of context 'when the sheet has no sections'
});

function _normalizedWithMissingSectionsInMain() {
  return Immutable.fromJS({main: {title: "theTitle", artist: "theArtist"}});
}

function _normalizedWithMissingChordsArrayInBar() {
  return Immutable.fromJS({
    main: {
      title: "theTitle",
      artist: "theArtist",
      sections: [ "section1" ]
    },
    sections: {
      section1: { id: "section1", name: "intro", rows: [ "row1" ] },
    },
    rows: {
      row1: { id: "row1", bars: [ "bar1" ] },
    },
    bars: {
      bar1: { id: "bar1" }
    }
  });
}

function _normalizedWithMissingBarsArrayInRow() {
  return Immutable.fromJS({
    main: {
      title: "theTitle",
      artist: "theArtist",
      sections: [ "section1" ]
    },
    sections: {
      section1: { id: "section1", name: "intro", rows: [ "row1" ] },
    },
    rows: {
      row1: { id: "row1" },
    }
  });
}

function _normalizedWithMissingRowsArrayInSection() {
  return Immutable.fromJS({
    main: { title: "theTitle", artist: "theArtist", sections: [ "section1" ] },
    sections: { section1: { id: "section1", name: "intro" }, },
  });
}



function _deNormalizedData() {
  return {
    title: "theTitle",
    artist: "theArtist",
    dbid: "THEDBID",
    sections: [
      {
        id: "section1",
        name: "intro",
        rows: [
          {
            id: "row1",
            bars: [
              {
                id: "bar1",
                chords: [
                  { id: "chord1", raw: "chord1-raw" },
                  { id: "chord2", raw: "chord2-raw" }
                ]
              },
              {
                id: "bar2",
                chords: [
                  { id: "chord3", raw: "chord3-raw" },
                  { id: "chord4", raw: "chord4-raw" }
                ]
              }
            ]
          },
          {
            id: "row2",
            bars: [
              {
                id: "bar3",
                chords: [ { id: "chord5", raw: "chord5-raw" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "section2",
        name: "verse",
        rows: [
          {
            id: "row3",
            bars: [
              {
                id: "bar4",
                chords: [ { id: "chord6", raw: "chord6-raw" } ]
              }
            ]
          }
        ]
      }
    ]
  }
}

function _normalizedData() {
  return Immutable.fromJS({
    main: {
      title: "theTitle",
      artist: "theArtist",
      dbid: "THEDBID",
      sections: [ "section1", "section2" ]
    },
    sections: {
      section1: { id: "section1", name: "intro", rows: [ "row1", "row2", ] },
      section2: { id: "section2", name: "verse", rows: [ "row3" ] }
    },
    rows: {
      row1: { id: "row1", bars: [ "bar1", "bar2" ] },
      row2: { id: "row2", bars: [ "bar3" ] },
      row3: { id: "row3", bars: [ "bar4" ] }
    },
    bars: {
      bar1: { id: "bar1", chords: [ "chord1", "chord2" ] },
      bar2: { id: "bar2", chords: [ "chord3", "chord4" ] },
      bar3: { id: "bar3", chords: [ "chord5" ] },
      bar4: { id: "bar4", chords: [ "chord6" ] }
    },
    chords: {
      chord1: { id: "chord1", raw: "chord1-raw" },
      chord2: { id: "chord2", raw: "chord2-raw" },
      chord3: { id: "chord3", raw: "chord3-raw" },
      chord4: { id: "chord4", raw: "chord4-raw" },
      chord5: { id: "chord5", raw: "chord5-raw" },
      chord6: { id: "chord6", raw: "chord6-raw" }
    }
  })
}
