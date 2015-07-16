(function() {

  "use strict";

  var Backbone = require('backbone')

  var FriendshipModel = Backbone.Model.extend({
    url: "/users/me/friends/",
    idAttribute: '_id',

    delete: function(friendID) {
      console.log(this.isNew());
      this.url = "/users/me/friends/" + friendID;
      this.set('_id', friendID);
      this.destroy();
    }

  });

  module.exports = new FriendshipModel();

}())
