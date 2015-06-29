(function() {

  var SheetDispatcher = require('../dispatcher/sheetDispatcher');
  var EventEmitter = require('events').EventEmitter;
  var SheetConstants = require('../sheetConstants');
  var assign = require('object-assign');

  var CHANGE_EVENT = 'change';
  var SHEET_DATA = {};

  function updateChordText(id, text) {
    console.log("In updateChordText raw function");
  }

  var SheetStore = assign({}, EventEmitter.prototype, {

    getSection: function(id) {
      return SHEET_DATA.entities.sections[id];
    },

    getRow: function(id) {
      return SHEET_DATA.entities.rows[id];
    },

    getBar: function(id) {
      return SHEET_DATA.entities.bars[id];
    },

    getChord: function(id) {
      return SHEET_DATA.entities.chords[id];
    },

    setInitialData: function(data) {
      SHEET_DATA = data;
    },

    getAllData: function() {
      return SHEET_DATA;
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
    console.log("Action received!");
    SheetStore.emitChange();
  });

  module.exports = SheetStore;

}())
