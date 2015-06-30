(function() {

  var SheetDispatcher = require('../dispatcher/sheetDispatcher');
  var EventEmitter = require('events').EventEmitter;
  var SheetConstants = require('../sheetConstants');
  var assign = require('object-assign');
  var deNormalize = require('./deNormalize');
  var SheetStoreDataManager = require('./sheetStoreDataManager');

  var CHANGE_EVENT = 'change';

  var SheetStore = assign({}, EventEmitter.prototype, {

    getState: function() {
      return deNormalize(SheetStoreDataManager.getData());
    },

    setInitialData: function(data) {
      SheetStoreDataManager.setData(data);
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    addEventListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeEventListener: function(callback) {
      this.removeListene(CHANGE_EVENT, callback);
    }

  });

  SheetDispatcher.register(function(action) {
    switch(action.actionType) {
      case SheetConstants.UPDATE_CHORD_TEXT:
        SheetStoreDataManager.updateChordText(action.id, action.text);
        SheetStore.emitChange();
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

  module.exports = SheetStore;

}())
