(function() {

  "use strict";

  var Backbone      = require('backbone')
    , FriendRequest = require('./friendRequestModel')

  var FriendshipModel = Backbone.Model.extend({
    urlRoot: "/users/me/friends/",
    idAttribute: '_id',

    defaults: {
      friendship: null,
      sentRequest: null,
      receivedRequest: null
    },

    sendRequest: function() {
      this.friendrequest = new FriendRequest({other_user_id: this.get("_id")});
      this.friendrequest.save();
      // Bind null, else synced values get sent into the fetch method as params
      this.friendrequest.on('sync', this.fetch.bind(this, null));
    },

    acceptRequest: function() {
      if (this.friendrequest) {
        this.friendrequest.save();
      }
    },

    destroyRequest: function() {
      this.friendrequest.destroy();
    },

    parse: function(response) {
      var request = response.sentRequest || response.receivedRequest;
      if (request) {
        this.friendrequest = new FriendRequest({_id: request._id});
        this.friendrequest.on('sync', this.fetch.bind(this, null));
      }
      return response;
    }
  });

  module.exports = FriendshipModel;

}())
