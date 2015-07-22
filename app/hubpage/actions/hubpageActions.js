(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')

  var UserpageConstants = keyMirror({
    UPDATE_FRIENDS_LIST: null,
    INVITE_FRIEND: null,
    CANCEL_INVITATION: null,
    UPDATE_INVITED_USER_PERMISSIONS: null
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
    },

    cancelInvitation: function(cid) {
      Dispatcher.dispatch({
        actionType: UserpageConstants.CANCEL_INVITATION,
        cid: cid
      });
    },

    updateInvitedUserPermissions: function(cid, newPermission) {
      Dispatcher.dispatch({
        actionType: UserpageConstants.UPDATE_INVITED_USER_PERMISSIONS,
        cid: cid,
        value: newPermission
      });
    }
  }

  module.exports = UserpageActions;
  module.exports.constants = UserpageConstants;

}())
