(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')

  var HubpageConstants = keyMirror({
    UPDATE_FRIENDS_LIST: null,
    INVITE_FRIEND: null,
    CANCEL_INVITATION: null,
    UPDATE_INVITED_USER_PERMISSIONS: null,
    REMOVE_PARTICIPANT: null,
    SHOW_CONFIRMATION_MODAL: null,
    FETCH_USERS_SHEETS: null,
    ADD_SHEET_TO_HUB: null
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

    updateInvitedUserPermissions: function(cid, newPermission) {
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
    },

    showConfirmationModal: function(title, body, onSuccess) {
      Dispatcher.dispatch({
        actionType: HubpageConstants.SHOW_CONFIRMATION_MODAL,
        title: title,
        body: body,
        onSuccess: onSuccess
      });
    },

    fetchUsersSheets: function() {
      Dispatcher.dispatch({
        actionType: HubpageConstants.FETCH_USERS_SHEETS
      });
    },

    addSheetToHub: function(dbid) {
      Dispatcher.dispatch({
        actionType: HubpageConstants.ADD_SHEET_TO_HUB,
        dbid: dbid
      });
    }
  }

  module.exports = HubpageActions;
  module.exports.constants = HubpageConstants;

}())
