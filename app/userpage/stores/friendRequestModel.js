(function() {

  "use strict";

  var Backbone = require('backbone')
    , Dispatcher = require('../dispatcher/userpageDispatcher')
    , Constants = require('../actions/userpageActions').constants

  var FriendRequestModel = Backbone.Model.extend({
    url: "/users/me/friends/requests/",

    send: function(other_user_id) {
      this.save({other_user_id: other_user_id});
    },

  });

  module.exports = new FriendRequestModel();

}())
