(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')

  var HubpageConstants = keyMirror({
    UPDATE_FRIENDS_LIST: null,
    INVITE_FRIEND: null,
    CANCEL_INVITATION: null,
    UPDATE_INVITED_USER_PERMISSIONS: null,
    REMOVE_PARTICIPANT: null
  });

  var HubpageActions = {
    updateFriendsList: function(query) {
      Dispatcher.dispatch({
        actionType: HubpageConstants.UPDATE_FRIENDS_LIST,
        query: query
      });
    },

    inviteFriend: function(friendID) {
      Dispatcher.dispatch({
        actionType: HubpageConstants.INVITE_FRIEND,
        friendID: friendID
      });
    },

    cancelInvitation: function(cid) {
      Dispatcher.dispatch({
        actionType: HubpageConstants.CANCEL_INVITATION,
        cid: cid
      });
    },

    updateInvitedHubPermissions: function(cid, newPermission) {
      Dispatcher.dispatch({
        actionType: HubpageConstants.UPDATE_INVITED_USER_PERMISSIONS,
        cid: cid,
        value: newPermission
      });
    },

    removeParticipant: function(cid) {
      Dispatcher.dispatch({
        actionType: HubpageConstants.REMOVE_PARTICIPANT,
        cid: cid
      });
    }
  }

  module.exports = HubpageActions;
  module.exports.constants = HubpageConstants;

}())
