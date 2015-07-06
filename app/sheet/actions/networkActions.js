(function() {

  "use strict";

  var SheetConstants = require('../sheetConstants');
  var NetworkDispatcher = require('../dispatcher/networkDispatcher');

  var NetworkActions = {

    save: function() {
      console.log("In actions");
      NetworkDispatcher.dispatch({actionType: SheetConstants.SAVE});
    },

    delete: function() {
      NetworkDispatcher.dispatch({actionType: SheetConstants.DELETE});
    }

  };

  module.exports = NetworkActions;

}())
