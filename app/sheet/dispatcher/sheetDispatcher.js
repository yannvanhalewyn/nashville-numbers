(function() {

  var Dispatcher = require('flux').Dispatcher;
  var SheetStore = require('../stores/sheetStore');
  var SheetStoreDataManager = require('../stores/sheetStoreDataManager');
  var Actions = require('../sheetConstants');

  var SheetDispatcher = new Dispatcher();

  SheetDispatcher.register(function(action) {
    switch(action.actionType) {
      case Actions.UPDATE_CHORD_TEXT:
        SheetStoreDataManager.updateChordText(action.id, action.text);
        break;

      case Actions.APPEND_NEW_CHORD:
        SheetStoreDataManager.appendNewChord(action.id, action.barID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_BAR:
        var selectedChordRef = SheetStore.getRefToSelectedChord();
        SheetStoreDataManager.appendNewBar(selectedChordRef.parentIDs.barID,
                                           selectedChordRef.parentIDs.rowID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_ROW:
        var selectedChordRef = SheetStore.getRefToSelectedChord();
        SheetStoreDataManager.appendNewRow(selectedChordRef.parentIDs.rowID,
                                           selectedChordRef.parentIDs.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_SECTION:
        var selectedChordRef = SheetStore.getRefToSelectedChord();
        SheetStoreDataManager.appendNewSection(selectedChordRef.parentIDs.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_BAR:
        var selectedChordRef = SheetStore.getRefToSelectedChord();
        SheetStoreDataManager.deleteBar(selectedChordRef.parentIDs.barID);
        SheetStore.emitChange();
        break;

      case Actions.STORE_CHORD_REF_AS_SELECTED:
        SheetStore.storeRefToSelectedChord(action.chordID, action.barID);
        break;

      default:
        console.error("No such task - " + action.actionType);
        break;
    }
  });

  module.exports = SheetDispatcher;

}())
