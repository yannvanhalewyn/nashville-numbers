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

  });

  SheetDispatcher.register(function(action) {
    console.log("Action received!");
  });

  module.exports = SheetStore;

}())
