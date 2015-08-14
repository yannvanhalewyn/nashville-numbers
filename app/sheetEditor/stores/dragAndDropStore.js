(function() {

  "use strict";

  var _ = require('lodash')
    , Dispatcher = require('../dispatcher/dragAndDropDispatcher')
    , Backbone = require('backbone')
    , Constants = require('../actions/dragAndDropActions').constants

  var DROP_CANDIDATE;

  var DragAndDropStore = function() {
    Dispatcher.register(function(payload) {
      switch (payload.actionType) {
        case Constants.DRAG_START:
          this.trigger('dragStart');
          break;

        case Constants.DROPPED:
          this.trigger('drop')
          console.log("DROP!", DROP_CANDIDATE)
          break;

        case Constants.STORE_DROP_CANDIDATE:
          DROP_CANDIDATE = payload.candidate;
          break;

        default:
          console.error("No such action " + payload.actionType);
      }
    }.bind(this));
    return _.extend(this, Backbone.Events);
  }

  module.exports = DragAndDropStore;

}())
