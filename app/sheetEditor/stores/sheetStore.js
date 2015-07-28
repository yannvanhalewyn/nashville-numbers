(function() {

  var assign = require('lodash').assign;
  var $ = require('jquery');

  var EventEmitter = require('events').EventEmitter;
  var SheetConstants = require('../sheetConstants');
  var SheetStoreDataManager = require('./sheetStoreDataManager');
  var deNormalize = require('../../helpers/deNormalize');

  var CHANGE_EVENT = 'change';

  var SheetStore = assign({}, EventEmitter.prototype, {

    getState: function() {
      return deNormalize(SheetStoreDataManager.getData().toJS());
    },

    setInitialData: function(sheet) {
      this.dbid = sheet._id;
      SheetStoreDataManager.setData(JSON.parse(sheet.properties.data));
    },

    setDefaultData: function() {
      var defaultData = {main: {title: "title", artist: "artist"}};
      SheetStoreDataManager.setData(defaultData);
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

    // Networking
    saveSheet: function() {
      var data = SheetStoreDataManager.getData();
      $.ajax({
        url: '/sheets/' + this.dbid,
        method: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(data.toJS())
      }).done(function(res) {
        alert("saved!");
      }).error(function(err) {
        alert("not saved. Check console.");
        console.log(err);
      });
    },

    // Not used right now, using a hidden form in control panel.
    deleteSheet: function() {
      var data = SheetStoreDataManager.getData();
      var dbid = data.getIn(['main', 'dbid']);
      $.ajax({
        url: '/sheets/' + dbid,
        method: "DELETE",
        headers: {Accept: "text/html"}
      }).done(function(res) {
        console.log(res);
      }).error(function(err) {
        console.error(err);
      });
    }

  });

  module.exports = SheetStore;

}())
