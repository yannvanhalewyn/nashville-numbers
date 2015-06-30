(function() {

  var EventEmitter = require('events').EventEmitter;
  var SheetConstants = require('../sheetConstants');
  var SheetStoreDataManager = require('./sheetStoreDataManager');
  var assign = require('object-assign');
  var deNormalize = require('./deNormalize');

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
    },

    storeRefToSelectedChord: function(chordID, barID) {
      this.selectedChordRef = {
        chordID: chordID,
        barID: barID
      }
    },

    getRefToSelectedChord: function() {
      return this.selectedChordRef;
    }

  });

  module.exports = SheetStore;

}())
