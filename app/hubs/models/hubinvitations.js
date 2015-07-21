(function() {

  "use strict";

  var Backbone = require('backbone');

  var HubInvitationModel = Backbone.Model.extend({
    idAttribute: "_id"
  });

  var HubInvitationCollection = Backbone.Collection.extend({
    url: "/users/me/hubinvitations",
    model: HubInvitationModel,

    // TODO I dislike this
    parse: function(res) {
      var ret = res[0].invitation;
      ret.hub = res[0].hub;
      ret.sender = res[0].sender;
      return ret;
    }
  });

  module.exports = HubInvitationCollection;

}())
