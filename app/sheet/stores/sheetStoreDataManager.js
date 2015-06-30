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
      // TODO use setIn()
      var tmp = SHEET_DATA.toJS();
      tmp.entities.chords[id].raw = text;
      SHEET_DATA = Immutable.fromJS(tmp);
    },

    appendNewChord: function(id, barID) {
      var chordIndex = SHEET_DATA.getIn(['entities', 'bars', barID, 'chords']).indexOf(id);
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
    var tmp =  SHEET_DATA.getIn(['entities', parentName, parentID, childName]).indexOf(childID);
    return tmp;
  }

  function _randomID() {
    return (+new Date() + Math.floor(Math.random() * 999999).toString(36));
  }

}())
