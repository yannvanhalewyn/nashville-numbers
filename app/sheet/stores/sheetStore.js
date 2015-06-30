
(function() {

  var SheetDispatcher = require('../dispatcher/sheetDispatcher');
  var EventEmitter = require('events').EventEmitter;
  var SheetConstants = require('../sheetConstants');
  var assign = require('object-assign');
  var Immutable = require('immutable');

  var CHANGE_EVENT = 'change';
  window.SHEET_DATA = Immutable.Map();

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
    // TODO use setIn()
    var tmp = SHEET_DATA.toJS();
    tmp.entities.chords[id].raw = text;
    SHEET_DATA = Immutable.fromJS(tmp);
  }

  function getIndexOfChildInParent(childName, parentName, childID, parentID) {
    var tmp =  SHEET_DATA.getIn(['entities', parentName, parentID, childName]).indexOf(childID);
    return tmp;
  }

  // TODO append at end if no index given (simple if statement in updateIN callback)
  function insertNewChildInParentAtIndex(childName, parentName, parentID, index) {
    // Lazy init Children array
    if (!SHEET_DATA.getIn(['entities', parentName, parentID, childName])) {
      SHEET_DATA = SHEET_DATA.setIn(['entities', parentName, parentID, childName],Immutable.List());
    }
    var newID = randomID();
    SHEET_DATA = SHEET_DATA.withMutations(function(data) {
      data
        // insert new entity
        .setIn(['entities', childName, newID], Immutable.Map({id: newID}))
        // Give parent a ref to that entity at index
        .updateIn(['entities', parentName, parentID, childName], function(childRefs) {
          if (index) {
            return childRefs.splice(index, 0, newID);
          } else {
            return childRefs.push(newID);
          }
        });
    });
    return newID;
  }

  function appendNewChord(id, barID) {
    var chordIndex = SHEET_DATA.getIn(['entities', 'bars', barID, 'chords']).indexOf(id);
    insertNewChildInParentAtIndex("chords", "bars", barID, chordIndex+1);
  }

  function appendNewBar(id, rowID) {
    var barIndex = getIndexOfChildInParent('bars', 'rows', id, rowID);
    var newID = insertNewChildInParentAtIndex('bars', 'rows', rowID, barIndex+1);
    insertNewChildInParentAtIndex('chords', 'bars', newID);
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

      case SheetConstants.APPEND_NEW_BAR:
        appendNewBar(action.id, action.rowID);
        SheetStore.emitChange();
        break;

      default:
        console.error("No such task - " + action.actionType);
        break;
    }
  });

  module.exports = SheetStore;

}())
