(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')

  var UserpageConstants = keyMirror({
    UPDATE_FRIENDS_LIST: null,
    INVITE_FRIEND: null
  });

  var UserpageActions = {
    updateFriendsList: function(query) {
      Dispatcher.dispatch({
        actionType: UserpageConstants.UPDATE_FRIENDS_LIST,
        query: query
      });
    },

    inviteFriend: function(friendID) {
      Dispatcher.dispatch({
        actionType: UserpageConstants.INVITE_FRIEND,
        friendID: friendID
      });
    }
  }

  module.exports = UserpageActions;
  module.exports.constants = UserpageConstants;

}())
