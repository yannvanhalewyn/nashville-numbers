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
      if (SHEET_DATA.getIn(['entities', 'chords', id])) {
        SHEET_DATA = SHEET_DATA.setIn(['entities', 'chords', id, 'raw'], text);
      }
    },

    addChord: function(barID, chordID) {
      if (SHEET_DATA.getIn(['entities', 'bars', barID])) {
        var chordIndex = _getIndexOfChildInParent('chords', 'bars', chordID, barID);
        _insertNewChildInParentAtIndex("chords", "bars", barID, chordIndex+1);
      }
    },

    deleteChord: function(chordID, barID) {
      _deleteEntityAndUpdateParent("chords", "bars", chordID, barID);
    },

    insertBarAfter: function(id, rowID) {
      var barIndex = _getIndexOfChildInParent('bars', 'rows', id, rowID);
      var newID = _insertNewChildInParentAtIndex('bars', 'rows', rowID, barIndex+1);
      _insertNewChildInParentAtIndex('chords', 'bars', newID);
    },

    appendBar: function(rowID) {
      var newID = _insertNewChildInParentAtIndex('bars', 'rows', rowID);
      _insertNewChildInParentAtIndex('chords', 'bars', newID);
    },

    deleteBar: function(barID, rowID) {
      _deleteEntityAndUpdateParent('bars', 'rows', barID, rowID);
    },

    insertRowAfter: function(rowID, sectionID) {
      var rowIndex = _getIndexOfChildInParent('rows', 'sections', rowID, sectionID);
      var newID = _insertNewChildInParentAtIndex('rows', 'sections', sectionID, rowIndex+1);
      for (var i = 0; i < 4; i++) {
        this.appendBar(newID);
      }
    },

    appendRow: function(sectionID) {
      var newID = _insertNewChildInParentAtIndex('rows', 'sections', sectionID);
      for (var i = 0; i < 4; i++) {
        this.appendBar(newID);
      }
    },

    deleteRow: function(rowID, sectionID) {
      _deleteEntityAndUpdateParent('rows', 'sections', rowID, sectionID);
    },

    insertSectionAfter: function(id) {
      var newID = _randomID();
      SHEET_DATA = SHEET_DATA.withMutations(function(data) {
        data
          .setIn(['entities', 'sections', newID], Immutable.fromJS({name: "section", id: newID, rows: []}))
          .updateIn(['result', 'sections'], function(list) {
            return list.push(newID);
          });
      });
      this.appendRow(newID);
    },

    deleteSection: function(sectionID) {
      SHEET_DATA = SHEET_DATA.withMutations(function(data) {
        data
          .deleteIn(['entities', 'section', sectionID])
          .updateIn(['result', 'sections'], function(list) {
            console.log(list);
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
    return SHEET_DATA.getIn(['entities', parentName, parentID, childName]).indexOf(childID);
  }

  function _deleteEntityAndUpdateParent(entityName, parentName, entityID, parentID) {
    SHEET_DATA = SHEET_DATA.deleteIn(['entities', entityName, entityID]);
    SHEET_DATA = SHEET_DATA.updateIn(['entities', parentName, parentID, entityName],
                                     function(list) {
      return list.splice(list.indexOf(entityID), 1);
    });
  }

  function _randomID() {
    return (+new Date() + Math.floor(Math.random() * 999999).toString(36));
  }

}())
