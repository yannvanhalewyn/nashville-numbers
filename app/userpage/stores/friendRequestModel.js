(function() {

  "use strict";

  var Backbone = require('backbone')

  var FriendRequestModel = Backbone.Model.extend({
    urlRoot: "/users/me/friends/requests/",
    idAttribute: '_id',
  });

  module.exports = FriendRequestModel;

}())
