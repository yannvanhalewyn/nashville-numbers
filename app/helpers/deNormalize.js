(function() {

 /*
  * The store is more perfomant operating on normalized data, e.g.:
  *
  * main:
  *   sections: [array of sectionIDS]
  *
  * sections:
  *   {someId}:
  *     id: {sameID}
  *     name: "intro"
  *     rows: [array of row IDS]
  * rows:
  *   {someID}:
  *     id: {sameID}
  *     bars: [array of bar IDS]
  *
  *  etc..
  *
  *  While my react tree works great with nested objects, like so:
  *
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

  module.exports = function(data) {
    if (!data.main) return {};

    var ret = {
      sections: []
    };

    // Loop over all sections
    _.each(data.main.sections, function(sectionID, iii) {
      var section = data.sections[sectionID];
      ret.sections[iii] = section;

      // Loop over all rows
      _.each(section.rows, function(rowID, jjj) {
        var row = data.rows[rowID];
        ret.sections[iii].rows[jjj] = row;

        // Loop over all bars
        _.each(row.bars, function(barID, kkk) {
          var bar = data.bars[barID];
          ret.sections[iii].rows[jjj].bars[kkk] = bar;

          // Loop over all chords
          _.each(bar.chords, function(chordID, lll) {
            var chord = data.chords[chordID];
            ret.sections[iii].rows[jjj].bars[kkk].chords[lll] = chord;
          });
        });
      });
    });
    return ret;
  };

}())
