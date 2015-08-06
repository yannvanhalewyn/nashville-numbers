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
    },

    toggleRepeatLeft: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.TOGGLE_REPEAT_LEFT});
    },

    toggleRepeatRight: function() {
      SheetDispatcher.dispatch({actionType: SheetConstants.TOGGLE_REPEAT_RIGHT});
    },

    renameSection: function(sectionID, newName) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.RENAME_SECTION,
        sectionID: sectionID,
        newName: newName
      });
    },

    setTitle: function(newTitle) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.SET_TITLE,
        newTitle: newTitle
      });
    },

    setArtist: function(newArtist) {
      SheetDispatcher.dispatch({
        actionType: SheetConstants.SET_ARTIST,
        newArtist: newArtist
      });
    },
  };

  module.exports = SheetActions;

}())
