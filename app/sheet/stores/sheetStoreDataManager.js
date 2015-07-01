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

    appendNewSection: function(id) {
      var newID = _randomID();
      SHEET_DATA = SHEET_DATA.withMutations(function(data) {
        data
          .setIn(['entities', 'sections', newID], Immutable.fromJS({name: "section", id: newID, rows: []}))
          .updateIn(['result', 'sections'], function(list) {
            return list.push(newID);
          });
      });
      console.log(SHEET_DATA);
    },

    deleteBar: function(barID) {
      _deleteEntityAndUpdateParent('bars', 'rows', barID);
    }

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

  function _deleteEntityAndUpdateParent(entityName, parentName, entityID) {
    var parentID = _getParentID(parentName, entityName, entityID);
    if (!parentID) {
      console.error("Could not find " + parentName + " containing " + entityName +
                    " with id: " + entityID);
      return;
    }
    SHEET_DATA = SHEET_DATA.deleteIn(['entities', entityName, entityID]);
    SHEET_DATA = SHEET_DATA.updateIn(['entities', parentName, parentID, entityName], function(list) {
      return list.splice(list.indexOf(entityID), 1);
    });
  }

  function _getParentID(parentName, childName, childID) {
    // Find parent
    var parentID;
    SHEET_DATA.getIn(['entities', parentName]).forEach(function(entity) {
      entity.get(childName).some(function(id) {
        if(id === childID) {
          parentID = entity.get('id');
          return true; // Break out of 'some' loop
        }
      });
    });
    return parentID;
  }

  function _randomID() {
    return (+new Date() + Math.floor(Math.random() * 999999).toString(36));
  }

}())
