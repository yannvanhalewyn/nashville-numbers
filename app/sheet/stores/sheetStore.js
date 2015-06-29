
(function() {

  var SheetDispatcher = require('../dispatcher/sheetDispatcher');
  var EventEmitter = require('events').EventEmitter;
  var SheetConstants = require('../sheetConstants');
  var assign = require('object-assign');
  var Immutable = require('immutable');

  var CHANGE_EVENT = 'change';
  var SHEET_DATA = Immutable.Map();

  /*
   * The store is usefull with normalized data, e.g.:

   * result:
   *   title: "Baby"
   *   artist: "Justin Bieber"
   *   sections: [array of sectionIDS]

   * entities:
   *   sections:
   *     {someId}:
   *       id: {sameID}
   *       name: "intro"
   *       rows: [array of row IDS]
   *  rows:
   *    {someID}:
   *      id: {sameID}
   *      bars: [array of bar IDS]

   *  etc..

   *  While my react tree works great with nested objects, like so:

   *  title: "baby"
   *  artist: "Justin Bieber"
   *  sections: [
   *    {
   *      name: "intro"
   *      rows: [ array of bars ]
   *    },
   *    {{ other rows }}
   *  ]

   *  The deNormalize function takes in a normalized format and makes it into a
   *  nested format, ready to be insert at the top level of the React sheet
   *  components
   */
  function deNormalize(data) {
    var result = data.get('result').toJS();
    var entities = data.get('entities').toJS();
    var ret = {
      title: result.title,
      artist: result.artist,
      sections: []
    };

    // Loop over all sections
    result.sections.forEach(function(sectionID, iii) {
      var section = entities.sections[sectionID];
      ret.sections[iii] = section;

      // Loop over all rows
      section.rows.forEach(function(rowID, jjj) {
        var row = entities.rows[rowID];
        ret.sections[iii].rows[jjj] = row;

        // Loop over all bars
        row.bars.forEach(function(barID, kkk) {
          var bar = entities.bars[barID];
          ret.sections[iii].rows[jjj].bars[kkk] = bar;

          // Loop over all chords
          bar.chords.forEach(function(chordID, lll) {
            var chord = entities.chords[chordID];
            ret.sections[iii].rows[jjj].bars[kkk].chords[lll] = chord;
          });
        });
      });
    });
    return ret;
  }

  function randomID() {
    return (+new Date() + Math.floor(Math.random() * 999999).toString(36));
  }

  function updateChordText(id, text) {
    var tmp = SHEET_DATA.toJS();
    tmp.entities.chords[id].raw = text;
    SHEET_DATA = Immutable.fromJS(tmp);
  }

  function appendNewChord(id, barID) {
    // handles
    var tmp = SHEET_DATA.toJS();
    var newID = randomID();
    // Create new Entity
    tmp.entities.chords[newID] = {id: newID, raw: ""};
    // Give parent bar a ref to that chord
    var barIDX = tmp.entities.bars[barID].chords.indexOf(id);
    tmp.entities.bars[barID].chords.splice(barIDX+1, 0, newID);
    // Update store
    SHEET_DATA = Immutable.fromJS(tmp);
  }

  var SheetStore = assign({}, EventEmitter.prototype, {

    getState: function() {
      return deNormalize(SHEET_DATA);
    },

    setInitialData: function(data) {
      SHEET_DATA = Immutable.fromJS(data);
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    addEventListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeEventListener: function(callback) {
      this.removeListene(CHANGE_EVENT, callback);
    }

  });

  SheetDispatcher.register(function(action) {
    switch(action.actionType) {
      case SheetConstants.UPDATE_CHORD_TEXT:
        updateChordText(action.id, action.text);
        SheetStore.emitChange();
        break;

      case SheetConstants.APPEND_NEW_CHORD:
        appendNewChord(action.id, action.barID);
        SheetStore.emitChange();
        break;

      default:
        console.log("No such task - " + action.actionType);
        break;
    }
  });

  module.exports = SheetStore;

}())
