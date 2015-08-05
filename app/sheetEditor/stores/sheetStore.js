(function() {

  var Backbone = require('backbone')
    , Constants = require('../sheetConstants')
    , SheetStoreDataManager = require('./sheetStoreDataManager')
    , deNormalize = require('../../helpers/deNormalize')
    , Dispatcher = require('../dispatcher/sheetDispatcher')
    , _ = require('lodash')

  var CHANGE_EVENT = 'change';

  var SheetStore = Backbone.Model.extend({

    idAttribute: "_id",
    urlRoot: "/sheets/",

    initialize: function(data) {
      SheetStoreDataManager.setData(JSON.parse(data.properties.data));
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this));
    },

    getState: function() {
      var json = this.toJSON();
      return {
        artist: json.properties.artist,
        title: json.properties.title,
        sheetData: deNormalize(SheetStoreDataManager.getData())
      }
    },

    storeRefToSelectedChord: function(chordID, parentIDs) {
      this.selectedChordRef = {
        chordID: chordID,
        barID: parentIDs.barID,
        rowID: parentIDs.rowID,
        sectionID: parentIDs.sectionID
      }
    },

    getRefToSelectedChord: function() {
      return this.selectedChordRef ? this.selectedChordRef : {};
    },

    dispatchCallback: function(payload) {
      var selected = this.getRefToSelectedChord();

      switch(payload.actionType) {
        case Constants.UPDATE_CHORD_TEXT:
          SheetStoreDataManager.updateChordText(payload.id, payload.text);
          break;

        case Constants.APPEND_NEW_CHORD:
          var newChordID = SheetStoreDataManager.addChord(selected.barID, selected.chordID);
          this.trigger(CHANGE_EVENT, {focus: newChordID});
          break;

        case Constants.APPEND_NEW_BAR:
          var newBarID = SheetStoreDataManager.addBar(selected.rowID, selected.barID);
          var chordToFocus = SheetStoreDataManager.getIDOfFirstChordInBar(newBarID);
          this.trigger(CHANGE_EVENT, {focus: chordToFocus});
          break;

        case Constants.APPEND_NEW_ROW:
          var newRowID = SheetStoreDataManager.addRow(selected.sectionID, selected.rowID);
          var chordToFocus = SheetStoreDataManager.getIDOfFirstChordInRow(newRowID);
          this.trigger(CHANGE_EVENT, {focus: chordToFocus});
          break;

        case Constants.APPEND_NEW_SECTION:
          var newSectionID = SheetStoreDataManager.addSection(selected.sectionID);
          var chordToFocus = SheetStoreDataManager.getIDOfFirstChordInSection(newSectionID);
          this.trigger(CHANGE_EVENT, {focus: chordToFocus});
          break;

        case Constants.DELETE_SELECTED_CHORD:
          var previousChordID = SheetStoreDataManager.getIDOfChordBefore(selected);
          SheetStoreDataManager.deleteChord(selected.chordID, selected.barID);
          this.trigger(CHANGE_EVENT, {focus: previousChordID});
          break;

        case Constants.DELETE_SELECTED_BAR:
          var previousBarID = SheetStoreDataManager.getIDOfBarBefore(selected);
          var chordToFocus = SheetStoreDataManager.getIDOfFirstChordInBar(previousBarID);
          SheetStoreDataManager.deleteBar(selected.barID, selected.rowID);
          this.trigger(CHANGE_EVENT, {focus: chordToFocus});
          break;

        case Constants.DELETE_SELECTED_ROW:
          var previousRowID = SheetStoreDataManager.getIDOfRowBefore(selected);
          var chordToFocus = SheetStoreDataManager.getIDOfFirstChordInRow(previousRowID);
          SheetStoreDataManager.deleteRow(selected.rowID, selected.sectionID);
          this.trigger(CHANGE_EVENT, {focus: chordToFocus});
          break;

        case Constants.DELETE_SELECTED_SECTION:
          var previousSectionID = SheetStoreDataManager.getIDOfSectionBefore(selected);
          var chordToFocus = SheetStoreDataManager.getIDOfFirstChordInSection(previousSectionID);
          SheetStoreDataManager.deleteSection(selected.sectionID);
          this.trigger(CHANGE_EVENT, {focus: chordToFocus});
          break;

        case Constants.STORE_CHORD_REF_AS_SELECTED:
          this.storeRefToSelectedChord(payload.chordID, payload.parentIDs);
          break;

        case Constants.SAVE_SHEET:
          // Manually set the nested data through an annoying trick because
          // backbone can't set nested data. TODO improve this + do I need to
          // stringify here or on the server?
          var properties = this.get("properties");
          properties.data = JSON.stringify(SheetStoreDataManager.getData());
          this.set("properties", properties);
          this.save();
          break;

        case Constants.TOGGLE_SEGNO:
          SheetStoreDataManager.toggleSegno(selected.barID);
          this.trigger(CHANGE_EVENT, {focus: selected.chordID});
          break;

        case Constants.TOGGLE_CODA:
          SheetStoreDataManager.toggleCoda(selected.barID);
          this.trigger(CHANGE_EVENT, {focus: selected.chordID});
          break;

        case Constants.TOGGLE_REPEAT_LEFT:
          SheetStoreDataManager.toggleRepeatLeft(selected.barID);
          this.trigger(CHANGE_EVENT, {focus: selected.chordID});
          break;

        case Constants.TOGGLE_REPEAT_RIGHT:
          SheetStoreDataManager.toggleRepeatRight(selected.barID);
          this.trigger(CHANGE_EVENT);
          break;

        default:
          console.error("No such task - " + payload.actionType);
          break;
      }
    }
  });

  module.exports = SheetStore;

}())
