(function() {

  "use strict";

  var Backbone = require('backbone');

  var FriendModel = Backbone.Model.extend({});

  var FriendCollection = Backbone.Collection.extend({
    model: FriendModel,
    url: "/users/me/friends"
  });

  module.exports = FriendCollection;

}())
