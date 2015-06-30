(function() {

  "use strict";
  var Immutable = require('immutable');

  var SHEET_DATA = Immutable.Map();

  var SheetStoreDataManager = {

    setData: function(data) {
      SHEET_DATA = Immutable.fromJS(data);
    },

    getData: function() {
      return SHEET_DATA;
    },

    updateChordText: function(id, text) {
      SHEET_DATA = SHEET_DATA.setIn(['entities', 'chords', id, 'raw'], text);
    },

    appendNewChord: function(id, barID) {
      var chordIndex = _getIndexOfChildInParent('chords', 'bars', id, barID);
      _insertNewChildInParentAtIndex("chords", "bars", barID, chordIndex+1);
    },

    appendNewBar: function(id, rowID) {
      var barIndex = _getIndexOfChildInParent('bars', 'rows', id, rowID);
      var newID = _insertNewChildInParentAtIndex('bars', 'rows', rowID, barIndex+1);
      _insertNewChildInParentAtIndex('chords', 'bars', newID);
    },
  };

  module.exports = SheetStoreDataManager;

/*
 * =========
 *   private
 * =========
 */
  function _insertNewChildInParentAtIndex(childName, parentName, parentID, index) {

    // Lazy init Children array
    if (!SHEET_DATA.getIn(['entities', parentName, parentID, childName])) {
      SHEET_DATA = SHEET_DATA.setIn(['entities', parentName, parentID, childName],
                                    Immutable.List());
    }

    // Insert entity as pleased
    var newID = _randomID();
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

  function _getIndexOfChildInParent(childName, parentName, childID, parentID) {
    return SHEET_DATA.getIn(['entities', parentName, parentID, childName]).indexOf(childID);
  }

  function _randomID() {
    return (+new Date() + Math.floor(Math.random() * 999999).toString(36));
  }

}())
