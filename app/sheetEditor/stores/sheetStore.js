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
          SheetStoreDataManager.addChord(selected.barID, selected.chordID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.APPEND_NEW_BAR:
          SheetStoreDataManager.addBar(selected.rowID, selected.barID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.APPEND_NEW_ROW:
          SheetStoreDataManager.addRow(selected.sectionID, selected.rowID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.APPEND_NEW_SECTION:
          SheetStoreDataManager.addSection(selected.sectionID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.DELETE_SELECTED_CHORD:
          SheetStoreDataManager.deleteChord(selected.chordID, selected.barID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.DELETE_SELECTED_BAR:
          SheetStoreDataManager.deleteBar(selected.barID, selected.rowID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.DELETE_SELECTED_ROW:
          SheetStoreDataManager.deleteRow(selected.rowID, selected.sectionID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.DELETE_SELECTED_SECTION:
          SheetStoreDataManager.deleteSection(selected.sectionID);
          this.trigger(CHANGE_EVENT);
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
          console.log(this);
          this.save();
          break;

        case Constants.TOGGLE_SEGNO:
          SheetStoreDataManager.toggleSegno(selected.barID);
          this.trigger(CHANGE_EVENT);
          break;

        case Constants.TOGGLE_CODA:
          SheetStoreDataManager.toggleCoda(selected.barID);
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
