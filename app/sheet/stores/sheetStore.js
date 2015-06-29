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

  function deNormalize(data) {

    var result = {
      title: data.result.title,
      artist: data.result.artist,
      sections: []
    };

    // Loop over all sections
    for (var iii in data.result.sections) {
      var SID = data.result.sections[iii];
      var s = data.entities.sections[SID];
      result.sections[iii] = s;
      // Loop over all rows
      for (var jjj in s.rows) {
        var RID = s.rows[jjj];
        var r = data.entities.rows[RID];
        result.sections[iii].rows[jjj] = r;
        // Loop over all bars
        for (var kkk in r.bars) {
          var BID = r.bars[kkk];
          var b = data.entities.bars[BID];
          result.sections[iii].rows[jjj].bars[kkk] = b;
          // Loop over all chords
          for (var lll in b.chords) {
            var CID = b.chords[lll];
            var c = data.entities.chords[CID];
            result.sections[iii].rows[jjj].bars[kkk].chords[lll] = c;
          }
        }
      }
    }
    return result;
  }

  var SheetStore = assign({}, EventEmitter.prototype, {

    getEntireState: function() {
      return deNormalize(SHEET_DATA);
    },

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
