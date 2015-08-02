(function() {

  var SheetDispatcher = require('../dispatcher/sheetDispatcher');
  var SheetConstants = require('../sheetConstants.js');

  var SheetActions = {

    updateChordText: function(id, text) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.UPDATE_CHORD_TEXT,
        text: text,
        id: id
      });
    },

    addChord: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.APPEND_NEW_CHORD});
    },

    addBar: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.APPEND_NEW_BAR});
    },

    addRow: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.APPEND_NEW_ROW});
    },

    addSection: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.APPEND_NEW_SECTION});
    },

    removeChord: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.DELETE_SELECTED_CHORD});
    },

    removeBar: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.DELETE_SELECTED_BAR});
    },

    removeRow: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.DELETE_SELECTED_ROW});
    },

    removeSection: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.DELETE_SELECTED_SECTION});
    },

    storeChordRefAsSelected: function(chordID, parentIDs) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.STORE_CHORD_REF_AS_SELECTED,
        chordID: chordID,
        parentIDs: parentIDs
      })
    },

    saveSheet: function() {
      SheetDispatcher.dispatch({ actionType: SheetConstants.SAVE_SHEET });
    },

    toggleSegno: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.TOGGLE_SEGNO});
    },

    toggleCoda: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.TOGGLE_CODA});
    }

  };

  module.exports = SheetActions;

}())
