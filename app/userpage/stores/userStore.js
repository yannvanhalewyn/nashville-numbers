(function() {

  "use strict";

  var Backbone      = require('backbone')
    , Dispatcher    = require('../dispatcher/userpageDispatcher')
    , Constants     = require('../actions/userpageActions').constants
    , FriendRequest = require('./friendRequestModel')
    , Friendship    = require('./friendshipModel')

  var UserStore = Backbone.Model.extend({
    initialize: function() {
      var jsonState = document.getElementById('initial_state').text;
      this.attributes = JSON.parse(jsonState);
      this.url = "/users/" + this.attributes._id;
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this))
    },

    dispatchCallback: function(payload) {
      switch (payload.actionType) {
        case Constants.SEND_FRIEND_REQUEST:
          FriendRequest.send(this.get("_id"));
          break;

        case Constants.ACCEPT_FRIEND_REQUEST:
          var requestID = this.get("friendship").receivedRequest._id;
          FriendRequest.accept(requestID);
          break;

        case Constants.DECLINE_FRIEND_REQUEST:
          var requestID = this.get("friendship").receivedRequest._id;
          FriendRequest.decline(requestID);
          break;

        case Constants.DELETE_FRIEND:
          var userID = this.get('_id');
          Friendship.delete(userID);
          break;

        default:
          console.error("No such action -- " + payload.actionType);
          break;
      }
    },

    getState: function() {
      return {
        userData: this.get("properties"),
        friendship: this.get("friendship")
      }
    }
  });

  module.exports = new UserStore();

}())
