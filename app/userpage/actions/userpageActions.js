(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatcher/userpageDispatcher')

  var UserpageConstants = keyMirror({
    SEND_FRIEND_REQUEST: null,
    ACCEPT_FRIEND_REQUEST: null,
    DECLINE_FRIEND_REQUEST: null,
    DELETE_FRIEND: null
  });

  var UserpageActions = {
    sendFriendRequest: function() {
      Dispatcher.dispatch({
        actionType: UserpageConstants.SEND_FRIEND_REQUEST
      });
    },

    acceptFriendRequest: function() {
      Dispatcher.dispatch({
        actionType: UserpageConstants.ACCEPT_FRIEND_REQUEST
      });
    },

    declineFriendRequest: function() {
      Dispatcher.dispatch({
        actionType: UserpageConstants.DECLINE_FRIEND_REQUEST
      });
    },

    deleteFriend: function() {
      Dispatcher.dispatch({
        actionType: UserpageConstants.DELETE_FRIEND
      });
    }
  }

  module.exports = UserpageActions;
  module.exports.constants = UserpageConstants;

}())
