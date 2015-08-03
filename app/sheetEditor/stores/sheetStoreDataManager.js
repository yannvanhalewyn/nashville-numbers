(function() {

  "use strict";

  var Immutable = require('immutable');

  var SHEET_DATA = Immutable.Map();
  var DEFAULT_NUM_BARS_IN_ROW = 4;

  var SheetStoreDataManager = {

    setData: function(data) {
      SHEET_DATA = Immutable.fromJS(data);
      if (!data.sections) {
        this.addSection();
      }
    },

    getData: function() {
      return SHEET_DATA.toJS();
    },

    updateChordText: function(id, text) {
      if (SHEET_DATA.getIn(['chords', id])) {
        SHEET_DATA = SHEET_DATA.setIn(['chords', id, 'raw'], text);
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
      if (SHEET_DATA.getIn(['bars', barID])) {
        var chordIndex = _getIndexOfChildInParent('chords', 'bars', chordID, barID);
        _insertNewChildInParentAtIndex("chords", "bars", barID, chordIndex+1);
      }
    },

    addBar: function(rowID, barID) {
      if (SHEET_DATA.getIn(['rows', rowID])) {
        var barIndex = _getIndexOfChildInParent('bars', 'rows', barID, rowID);
        var newID = _insertNewChildInParentAtIndex('bars', 'rows', rowID, barIndex+1);
        this.addChord(newID);
      }
    },

    addRow: function(sectionID, rowID) {
      if (SHEET_DATA.getIn(['sections', sectionID])) {
        var rowIndex = _getIndexOfChildInParent('rows', 'sections', rowID, sectionID);
        var newID = _insertNewChildInParentAtIndex('rows', 'sections', sectionID, rowIndex + 1);
        for (var i = 0; i < DEFAULT_NUM_BARS_IN_ROW; i++) {
          this.addBar(newID);
        }
      }
    },

    addSection: function(sectionID) {
      // Lazy init sections array
      if (!SHEET_DATA.getIn(['main', 'sections'])) {
        SHEET_DATA = SHEET_DATA.setIn(['main', 'sections'], Immutable.List());
      }

      // Add the new section
      var newID = _randomID();
      var index = SHEET_DATA.getIn(['main', 'sections']).indexOf(sectionID);
      SHEET_DATA = SHEET_DATA.withMutations(function(data) {
        data
          .setIn(['sections', newID], Immutable.fromJS({
            id: newID, name: "section", rows: []}))
          .updateIn(['main', 'sections'], function(list) {
            if (index === -1) {
              return list.push(newID);
            } else {
              return list.splice(index+1, 0, newID);
            }
          });
      });
      this.addRow(newID);
    },

/*
 * =================
 * Removing Entities
 * =================
 */
    deleteChord: function(chordID, barID) {
      var wasDeleted = _deleteEntityAndUpdateParent("chords", "bars", chordID, barID);
      if(wasDeleted && SHEET_DATA.getIn(['bars', barID, 'chords']).size === 0) {
        var rowID = _getParentID(barID, "bars", "rows");
        this.deleteBar(barID, rowID);
      }
    },

    deleteBar: function(barID, rowID) {
      var wasDeleted = _deleteEntityAndUpdateParent('bars', 'rows', barID, rowID);
      if(wasDeleted && SHEET_DATA.getIn(['rows', rowID, 'bars']).size === 0) {
        var sectionID = _getParentID(rowID, "rows", "sections");
        var d = this.deleteRow(rowID, sectionID);
      }
    },

    deleteRow: function(rowID, sectionID) {
      var wasDeleted = _deleteEntityAndUpdateParent('rows', 'sections', rowID, sectionID);
      if (wasDeleted && SHEET_DATA.getIn(['sections', sectionID, 'rows']).size === 0) {
        this.deleteSection(sectionID);
      }
    },

    deleteSection: function(sectionID) {
      if (!SHEET_DATA.getIn(['sections', sectionID])) {
        return;
      }
      SHEET_DATA = SHEET_DATA.withMutations(function(data) {
        data
          .deleteIn(['sections', sectionID])
          .updateIn(['main', 'sections'], function(list) {
            return list.splice(list.indexOf(sectionID), 1);
          });
      })
    },
/*
 * =======
 * SYMBOLS
 * =======
 */

  toggleSegno: function(barID) {
    if (!_toggleSymbolOnBar('segno', barID)) {
      throw "Could not toggle segno on bar " + barID + ".";
    }
  },

  toggleCoda: function(barID) {
    if (!_toggleSymbolOnBar('coda', barID)) {
      throw "Could not toggle coda on bar " + barID + ".";
    }
  },

  toggleRepeatLeft: function(barID) {
    if (!_toggleSymbolOnBar('repeatLeft', barID)) {
      throw "Could not toggle repeat-left on bar " + barID + ".";
    }
  },

  toggleRepeatRight: function(barID) {
    if (!_toggleSymbolOnBar('repeatRight', barID)) {
      throw "Could not toggle repeat-right on bar " + barID + ".";
    }
  }


  };

  module.exports = SheetStoreDataManager;

/*
 * =======
 * private
 * =======
 */
  function _insertNewChildInParentAtIndex(childName, parentName, parentID, index) {
    // Lazy init Children array
    if (!SHEET_DATA.getIn([parentName, parentID, childName])) {
      SHEET_DATA = SHEET_DATA.setIn([parentName, parentID, childName], Immutable.List());
    }

    // Insert entity as pleased
    var newID = _randomID();
    SHEET_DATA = SHEET_DATA.withMutations(function(data) {
      data
        // insert new entity
        .setIn([childName, newID], Immutable.Map({id: newID}))
        // Give parent a ref to that entity at index
        .updateIn([parentName, parentID, childName], function(childRefs) {
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
    if (SHEET_DATA.getIn([parentName, parentID, childName])) {
      return SHEET_DATA.getIn([parentName, parentID, childName]).indexOf(childID);
    }
  }

  function _deleteEntityAndUpdateParent(entityName, parentName, entityID, parentID) {
    var childrenRefsInParent = SHEET_DATA.getIn([parentName, parentID, entityName]);
    if (!childrenRefsInParent || childrenRefsInParent.indexOf(entityID) === -1) {
      return false;
    }

    SHEET_DATA = SHEET_DATA.deleteIn([entityName, entityID]);
    SHEET_DATA = SHEET_DATA.updateIn([parentName, parentID, entityName],
                                     function(list) {
      return list.splice(list.indexOf(entityID), 1);
    });
    return true;
  }

  function _getParentID(childID, childName, parentName) {
    var parentID;
    var found = SHEET_DATA.getIn([parentName]).some(function(parent) {
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

  function _toggleSymbolOnBar(symbolName, barID) {
    if (!SHEET_DATA.getIn(['bars', barID])) { return false; }
    var previousFlag = SHEET_DATA.getIn(['bars', barID, symbolName]);
    SHEET_DATA = SHEET_DATA.setIn(['bars', barID, symbolName], !previousFlag);
    return true;
  }

}())
