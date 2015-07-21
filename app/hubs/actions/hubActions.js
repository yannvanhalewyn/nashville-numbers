(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../../dispatcher/generic_dispatcher')

  var Constants = keyMirror({
    ACCEPT_HUB_INVITATION: null,
    DECLINE_HUB_INVITATION: null
  });

  var Actions = {
    acceptHubInvitation: function(cid) {
      Dispatcher.dispatch({
        actionType: Constants.ACCEPT_HUB_INVITATION,
        cid: cid
      });
    }
  }

  module.exports = Actions;
  module.exports.constants = Constants;

}())
