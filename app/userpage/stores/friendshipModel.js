(function() {

  "use strict";

  var Backbone = require('backbone')

  var FriendshipModel = Backbone.Model.extend({
    urlRoot: "/users/me/friends/",
    idAttribute: '_id',

    defaults: {
      friendship: null,
      sentRequest: null,
      receivedRequest: null
    },
  });

  module.exports = FriendshipModel;

}())
