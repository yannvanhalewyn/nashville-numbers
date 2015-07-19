(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')

  var UserpageConstants = keyMirror({
    UPDATE_FRIENDS_LIST: null
  });

  var UserpageActions = {
    updateFriendsList: function(query) {
      Dispatcher.dispatch({
        actionType: UserpageConstants.UPDATE_FRIENDS_LIST,
        query: query
      });
    }
  }

  module.exports = UserpageActions;
  module.exports.constants = UserpageConstants;

}())
