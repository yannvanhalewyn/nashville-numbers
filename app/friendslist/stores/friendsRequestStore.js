(function() {

  "use strict";

  var Backbone = require('backbone')
    , Dispatcher = require('../dispatcher/friendsDispatcher')
    , Constants = require('../actions/friendActions').constants

  var FriendRequestModel = Backbone.Model.extend({});

  var FriendRequestCollection = Backbone.Collection.extend({
    model: FriendRequestModel,
    url: "/users/me/friends/requests/",

    initialize: function() {
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this))
    },

    dispatchCallback: function(payload) {
      switch (payload.actionType) {
        case Constants.SEND_FRIEND_REQUEST:
          this.create({other_user_id: payload.friendID});
          break;

        default:
          console.error("No such action -- " + payload.actionType);
          break;
      }
    }

  });

  module.exports = new FriendRequestCollection();

}())
