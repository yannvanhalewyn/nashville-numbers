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

    appendChord: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.APPEND_NEW_CHORD});
    },

    appendBar: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.APPEND_NEW_BAR});
    },

    appendRow: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.APPEND_NEW_ROW});
    },

    appendSection: function() {
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

    storeChordRefAsSelected: function(chordID, barID) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.STORE_CHORD_REF_AS_SELECTED,
        chordID: chordID,
        barID: barID
      })
    }

  };

  module.exports = SheetActions;

}())
