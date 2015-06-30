(function() {

  var Dispatcher = require('flux').Dispatcher;
  var SheetStore = require('../stores/sheetStore');
  var SheetStoreDataManager = require('../stores/sheetStoreDataManager');
  var SheetConstants = require('../sheetConstants');

  var SheetDispatcher = new Dispatcher();

  SheetDispatcher.register(function(action) {
    switch(action.actionType) {
      case SheetConstants.UPDATE_CHORD_TEXT:
        SheetStoreDataManager.updateChordText(action.id, action.text);
        break;

      case SheetConstants.APPEND_NEW_CHORD:
        SheetStoreDataManager.appendNewChord(action.id, action.barID);
        SheetStore.emitChange();
        break;

      case SheetConstants.APPEND_NEW_BAR:
        SheetStoreDataManager.appendNewBar(action.id, action.rowID);
        SheetStore.emitChange();
        break;

      default:
        console.error("No such task - " + action.actionType);
        break;
    }
  });

  module.exports = SheetDispatcher;

}())
