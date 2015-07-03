(function() {

  "use strict";
  var Immutable = require('immutable');

  var SHEET_DATA = Immutable.Map();
  var DEFAULT_NUM_BARS_IN_ROW = 4;

  var SheetStoreDataManager = {

    setData: function(data) {
      SHEET_DATA = Immutable.fromJS(data);
    },

    getData: function() {
      return SHEET_DATA;
    },

    updateChordText: function(id, text) {
      if (SHEET_DATA.getIn(['entities', 'chords', id])) {
        SHEET_DATA = SHEET_DATA.setIn(['entities', 'chords', id, 'raw'], text);
      }
    },

    /*
     * ===============
     * Adding entities
     * ===============
     *
     * All of these functions take in an optional ID of the entity after which a
     * new one wishes to be appended. If none is supplied, or the given entity
     * was not found, a new one will be created at the end of the parent.
     * e.g. addRow will append a row at the end of the section.
     *
     */
    addChord: function(barID, chordID) {
      if (SHEET_DATA.getIn(['entities', 'bars', barID])) {
        var chordIndex = _getIndexOfChildInParent('chords', 'bars', chordID, barID);
        _insertNewChildInParentAtIndex("chords", "bars", barID, chordIndex+1);
      }
    },

    addBar: function(rowID, barID) {
      if (SHEET_DATA.getIn(['entities', 'rows', rowID])) {
        var barIndex = _getIndexOfChildInParent('bars', 'rows', barID, rowID);
        var newID = _insertNewChildInParentAtIndex('bars', 'rows', rowID, barIndex+1);
        this.addChord(newID);
      }
    },

    addRow: function(sectionID, rowID) {
      if (SHEET_DATA.getIn(['entities', 'sections', sectionID])) {
        var rowIndex = _getIndexOfChildInParent('rows', 'sections', rowID, sectionID);
        var newID = _insertNewChildInParentAtIndex('rows', 'sections', sectionID, rowIndex + 1);
        for (var i = 0; i < DEFAULT_NUM_BARS_IN_ROW; i++) {
          this.addBar(newID);
        }
      }
    },

    addSection: function(sectionID) {
      var newID = _randomID();
      var index = SHEET_DATA.getIn(['result', 'sections']).indexOf(sectionID)
      SHEET_DATA = SHEET_DATA.withMutations(function(data) {
        data
          .setIn(['entities', 'sections', newID], Immutable.fromJS({
            id: newID, name: "section", rows: []}))
          .updateIn(['result', 'sections'], function(list) {
            if (index === -1) {
              return list.push(newID);
            } else {
              return list.splice(index+1, 0, newID);
            }
          })
      });
      this.addRow(newID);
    },

/*
 * =================
 * Removing Entities
 * =================
 */
    deleteChord: function(chordID, barID) {
      var deleted = _deleteEntityAndUpdateParent("chords", "bars", chordID, barID);
      if(deleted && SHEET_DATA.getIn(['entities', 'bars', barID, 'chords']).size === 0) {
        var rowID = _getParentID(barID, "bars", "rows");
        this.deleteBar(barID, rowID);
      }
    },

    deleteBar: function(barID, rowID) {
      var deleted = _deleteEntityAndUpdateParent('bars', 'rows', barID, rowID);
      if(deleted && SHEET_DATA.getIn(['entities', 'rows', rowID, 'bars']).size === 0) {
        var sectionID = _getParentID(rowID, "rows", "sections");
        var d = this.deleteRow(rowID, sectionID);
      }
    },

    deleteRow: function(rowID, sectionID) {
      _deleteEntityAndUpdateParent('rows', 'sections', rowID, sectionID);
    },

    deleteSection: function(sectionID) {
      if (!SHEET_DATA.getIn(['entities', 'sections', sectionID])) {
        return;
      }
      SHEET_DATA = SHEET_DATA.withMutations(function(data) {
        data
          .deleteIn(['entities', 'sections', sectionID])
          .updateIn(['result', 'sections'], function(list) {
            return list.splice(list.indexOf(sectionID), 1);
          });
      })
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
    if (SHEET_DATA.getIn(['entities', parentName, parentID, childName])) {
      return SHEET_DATA.getIn(['entities', parentName, parentID, childName]).indexOf(childID);
    }
  }

  function _deleteEntityAndUpdateParent(entityName, parentName, entityID, parentID) {
    if (!SHEET_DATA.getIn(['entities', parentName, parentID, entityName]) ||
        SHEET_DATA.getIn(['entities', parentName, parentID, entityName]).
          indexOf(entityID) === -1) {
      return false;
    }

    SHEET_DATA = SHEET_DATA.deleteIn(['entities', entityName, entityID]);
    SHEET_DATA = SHEET_DATA.updateIn(['entities', parentName, parentID, entityName],
                                     function(list) {
      return list.splice(list.indexOf(entityID), 1);
    });
    return true;
  }

  function _getParentID(childID, childName, parentName) {
    var parentID;
    var found = SHEET_DATA.getIn(['entities', parentName]).some(function(parent) {
      parentID = parent.get('id');
      return parent.get(childName).indexOf(childID) !== -1
    });
    if (found) {
      return parentID;
    }
  }

  function _randomID() {
    return (+new Date() + Math.floor(Math.random() * 999999).toString(36));
  }

}())
