(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatcher/userpageDispatcher')

  var UserpageConstants = keyMirror({
    SEND_FRIEND_REQUEST: null
  });

  var UserpageActions = {
    sendFriendRequest: function() {
      Dispatcher.dispatch({
        actionType: UserpageConstants.SEND_FRIEND_REQUEST
      })
    }
  }

  module.exports = UserpageActions;
  module.exports.constants = UserpageConstants;

}())
