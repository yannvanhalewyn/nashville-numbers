(function() {

  "use strict";

  var Backbone      = require('backbone')
    , Dispatcher    = require('../dispatcher/userpageDispatcher')
    , Constants     = require('../actions/userpageActions').constants
    , FriendRequest = require('./friendRequestModel')
    , Friendship    = require('./friendshipModel')

  var UserStore = Backbone.Model.extend({
    initialize: function() {
      // Get initial state from hidden JSON script field
      var jsonState = document.getElementById('initial_state').text;
      this.set(JSON.parse(jsonState));

      // Setup dispatcher
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this))

      // Setup friendship model
      this.friendship = new Friendship({_id: this.get("_id")});
      this.friendship.fetch();
      this.friendship.on('sync', this._friendshipSynced, this);
    },

    dispatchCallback: function(payload) {
      switch (payload.actionType) {
        case Constants.SEND_FRIEND_REQUEST:
          // Sends POST to /users/me/friends/requests
          this.friendrequest = new FriendRequest({other_user_id: this.get("_id")});
          this.friendrequest.save();
          this.friendrequest.on('sync', this._friendrequestSynced, this);
          break;

        case Constants.ACCEPT_FRIEND_REQUEST:
          var requestID = this.friendship.get("receivedRequest")._id;
          // Sends PUT request to /users/me/friends/requests/:requestID
          this.friendrequest = new FriendRequest({_id: requestID})
          this.friendrequest.save();
          this.friendrequest.on('sync', this._friendrequestSynced, this);
          break;

        case Constants.DECLINE_FRIEND_REQUEST:
          var requestID = this.friendship.get("receivedRequest")._id;
          // Sends DELETE to /users/me/friends/request/:requestID
          this.friendrequest = new FriendRequest({_id: requestID})
          this.friendrequest.destroy();
          this.friendrequest.on('sync', this._friendrequestSynced, this);
          break;

        case Constants.CANCEL_FRIEND_REQUEST:
          var requestID = this.friendship.get("sentRequest")._id;
          // Sends DELETE to /users/me/friends/request/:requestID
          this.friendrequest = new FriendRequest({_id: requestID})
          this.friendrequest.destroy();
          this.friendrequest.on('sync', this._friendrequestSynced, this);
          break;

        case Constants.DELETE_FRIEND:
          var userID = this.get('_id');
          // sends DELETE to /users/me/friends/:friendID (current user page ID)
          this.friendship.destroy();
          break;

        default:
          console.error("No such action -- " + payload.actionType);
          break;
      }
    },

    getState: function() {
      return {
        userData: this.get("properties"),
        friendship: this.friendship.attributes // TODO clone this
      }
    },

    _friendshipSynced: function(update, response) {
      console.log(this.friendship);
      this.trigger('friendship:sync', update, response);
    },

    _friendrequestSynced: function(update, response) {
      this.friendship.fetch();
    }
  });

  var userStore = new UserStore();
  console.log("userStore instance", userStore);
  userStore.on('custom', function() {
    console.log("GOT TRIGGER");
  });
  module.exports = userStore;

}())
