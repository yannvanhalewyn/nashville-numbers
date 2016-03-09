(function() {

  "use strict";

  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatcher/dragAndDropDispatcher')

  var Constants = keyMirror({
    DRAG_START: null,
    DROPPED: null,
    STORE_DROP_CANDIDATE: null
  });

  var Actions = {
    dragStart: function(dragItem) {
      Dispatcher.dispatch({
        actionType: Constants.DRAG_START,
        dragItem: dragItem
      });
    },

    dropped: function() {
      Dispatcher.dispatch({
        actionType: Constants.DROPPED
      });
    },

    storeDropCandidate: function(candidate) {
      Dispatcher.dispatch({
        actionType: Constants.STORE_DROP_CANDIDATE,
        candidate: candidate
      })
    }
  }

  module.exports.actions = Actions;
  module.exports.constants = Constants;

}())
