(function() {

  var Dispatcher = require('flux').Dispatcher;
  var SheetStore = require('../stores/sheetStore');
  var SheetStoreDataManager = require('../stores/sheetStoreDataManager');
  var Actions = require('../sheetConstants');

  var SheetDispatcher = new Dispatcher();

  SheetDispatcher.register(function(action) {
    var selected = SheetStore.getRefToSelectedChord();

    switch(action.actionType) {
      case Actions.UPDATE_CHORD_TEXT:
        SheetStoreDataManager.updateChordText(action.id, action.text);
        break;

      case Actions.APPEND_NEW_CHORD:
        SheetStoreDataManager.insertChordAfter(selected.id, selected.parentIDs.barID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_BAR:
        SheetStoreDataManager.insertBarAfter(selected.parentIDs.barID, selected.parentIDs.rowID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_ROW:
        SheetStoreDataManager.insertRowAfter(selected.parentIDs.rowID,
                                             selected.parentIDs.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_SECTION:
        SheetStoreDataManager.insertSectionAfter(selected.parentIDs.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_CHORD:
        SheetStoreDataManager.deleteChord(selected.chordID, selected.parentIDs.barID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_BAR:
        SheetStoreDataManager.deleteBar(selected.parentIDs.barID,
                                        selected.parentIDs.rowID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_ROW:
        SheetStoreDataManager.deleteRow(selected.parentIDs.rowID,
                                        selected.parentIDs.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_SECTION:
        SheetStoreDataManager.deleteSection(selected.parentIDs.sectionID);
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
