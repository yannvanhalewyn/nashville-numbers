(function() {

  "use strict";

  var Backbone      = require('backbone')
    , Dispatcher    = require('../dispatcher/userpageDispatcher')
    , Constants     = require('../actions/userpageActions').constants
    , Friendship    = require('./friendshipModel')

  var UserStore = Backbone.Model.extend({
    initialize: function() {
      // Get initial state from hidden JSON script field
      var jsonState = document.getElementById('initial_state').text;
      this.set(JSON.parse(jsonState));

      // Setup dispatcher
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this))

      // Setup friendship model
      // Target userID and potential friendID are the same!
      this.friendship = new Friendship({_id: this.get("_id")});
      this.friendship.fetch();

      // Retrigger a friendship:sync event for react components. This way they
      // only listen to the store, and don't care about the models behind it.
      this.friendship.on('sync', this.trigger.bind(this, 'friendship:sync'));
    },

    dispatchCallback: function(payload) {
      switch (payload.actionType) {
        case Constants.SEND_FRIEND_REQUEST:
          this.friendship.sendRequest();
          break;

        case Constants.ACCEPT_FRIEND_REQUEST:
          this.friendship.acceptRequest();
          break;

        case Constants.DECLINE_FRIEND_REQUEST:
        case Constants.CANCEL_FRIEND_REQUEST:
          this.friendship.destroyRequest();
          break;

        case Constants.DELETE_FRIEND:
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
    }
  });

  module.exports = new UserStore();

}())
