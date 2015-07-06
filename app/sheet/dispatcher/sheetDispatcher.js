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
        SheetStoreDataManager.addChord(selected.barID, selected.chordID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_BAR:
        SheetStoreDataManager.addBar(selected.rowID, selected.barID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_ROW:
        SheetStoreDataManager.addRow(selected.sectionID, selected.rowID);
        SheetStore.emitChange();
        break;

      case Actions.APPEND_NEW_SECTION:
        SheetStoreDataManager.addSection(selected.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_CHORD:
        SheetStoreDataManager.deleteChord(selected.chordID, selected.barID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_BAR:
        SheetStoreDataManager.deleteBar(selected.barID,
                                        selected.rowID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_ROW:
        SheetStoreDataManager.deleteRow(selected.rowID,
                                        selected.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.DELETE_SELECTED_SECTION:
        SheetStoreDataManager.deleteSection(selected.sectionID);
        SheetStore.emitChange();
        break;

      case Actions.STORE_CHORD_REF_AS_SELECTED:
        SheetStore.storeRefToSelectedChord(action.chordID, action.parentIDs);
        break;

      default:
        console.error("No such task - " + action.actionType);
        break;
    }
  });

  module.exports = SheetDispatcher;

}())
