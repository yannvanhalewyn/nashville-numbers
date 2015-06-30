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

    appendNewChord: function(id, barID) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.APPEND_NEW_CHORD,
        id: id,
        barID: barID
      });
    },

    appendNewBar: function(id, rowID) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.APPEND_NEW_BAR,
        id: id,
        rowID: rowID
      });
    },

    deleteSelectedBar: function() {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.DELETE_SELECTED_BAR,
      });
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
