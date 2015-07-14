(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , UserDispatcher = require('../dispatcher/usersDispatcher')
    , FriendDispatcher = require('../dispatcher/friendsDispatcher')

  var FriendConstants = keyMirror({
    SEARCH_FOR_USERS: null,
    SEND_FRIEND_REQUEST: null
  });

  var FriendActions = {
    searchForUsers: function(searchValue) {
      UserDispatcher.dispatch({
        actionType: FriendConstants.SEARCH_FOR_USERS,
        searchValue: searchValue
      });
    },

    sendFriendRequest: function(friendID) {
      FriendDispatcher.dispatch({
        actionType: FriendConstants.SEND_FRIEND_REQUEST,
        friendID: friendID
      })
    }
  }

  module.exports = FriendActions;
  module.exports.constants = FriendConstants;

}())
