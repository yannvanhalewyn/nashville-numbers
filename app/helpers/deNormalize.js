(function() {

 /*
  * The store is usefull with normalized data, e.g.:
  *
  * result:
  *   title: "Baby"
  *   artist: "Justin Bieber"
  *   sections: [array of sectionIDS]
  *
  * entities:
  *   sections:
  *     {someId}:
  *       id: {sameID}
  *       name: "intro"
  *       rows: [array of row IDS]
  *   rows:
  *     {someID}:
  *       id: {sameID}
  *       bars: [array of bar IDS]
  *
  *  etc..
  *
  *  While my react tree works great with nested objects, like so:
  *
  *  title: "baby"
  *  artist: "Justin Bieber"
  *  sections: [
  *    {
  *      name: "intro"
  *      rows: [ array of bars ]
  *    },
  *    {{ other rows }}
  *  ]
  *
  *  The deNormalize function takes in a normalized format and makes it into a
  *  nested format, ready to be insert at the top level of the React sheet
  *  components
  */

  var _ = require('lodash');

  // TODO dbid shouldn't be here.
  // TODO should not EXPECT Immutable data
  module.exports = function(data) {
    var input = data.toJS();
    var ret = {
      title: input.main.title,
      artist: input.main.artist,
      dbid: input.main.dbid,
      sections: []
    };

    // Loop over all sections
    _.each(input.main.sections, function(sectionID, iii) {
      var section = input.sections[sectionID];
      ret.sections[iii] = section;

      // Loop over all rows
      _.each(section.rows, function(rowID, jjj) {
        var row = input.rows[rowID];
        ret.sections[iii].rows[jjj] = row;

        // Loop over all bars
        _.each(row.bars, function(barID, kkk) {
          var bar = input.bars[barID];
          ret.sections[iii].rows[jjj].bars[kkk] = bar;

          // Loop over all chords
          _.each(bar.chords, function(chordID, lll) {
            var chord = input.chords[chordID];
            ret.sections[iii].rows[jjj].bars[kkk].chords[lll] = chord;
          });
        });
      });
    });
    return ret;
  };

}())
