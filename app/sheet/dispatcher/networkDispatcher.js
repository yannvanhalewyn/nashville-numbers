(function() {

  "use strict";

  var Dispatcher = require('flux').Dispatcher;
  var SheetStore = require('../stores/sheetStore');
  var SheetConstants = require('../sheetConstants');

  var NetworkDispatcher = new Dispatcher();

  NetworkDispatcher.register(function(action) {
    switch (action.actionType) {
      case SheetConstants.SAVE:
        SheetStore.saveSheet();
        break;
      default:
        console.error("Unknow task " + action.actionType + " in NetworkDispatcher.");
        break;

    }
  });

  module.exports = NetworkDispatcher;

}())
