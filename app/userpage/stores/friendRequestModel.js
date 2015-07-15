(function() {

  "use strict";

  var Backbone = require('backbone')
    , Dispatcher = require('../dispatcher/userpageDispatcher')
    , Constants = require('../actions/userpageActions').constants

  var FriendRequestModel = Backbone.Model.extend({
    url: "/users/me/friends/requests/",
    idAttribute: '_id',

    send: function(other_user_id) {
      this.save({other_user_id: other_user_id});
    },

    accept: function(requestID) {
      this.url = "/users/me/friends/requests/" + requestID;
      this.set('_id', requestID); // Little trick to get backbone to PUT (which accepts the req)
      this.save();
    },

    decline: function(requestID) {
      console.log("DECLINE " + requestID);
    }

  });

  module.exports = new FriendRequestModel();

}())
