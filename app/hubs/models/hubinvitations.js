(function() {

  "use strict";

  var Backbone = require('backbone');

  var HubInvitationModel = Backbone.Model.extend({
    idAttribute: "_id",

    parse: function(res) {
      console.log("PARSE");
      console.log(res);
      var ret = res.invitation;
      ret.hub = res.hub;
      ret.sender = res.sender;
      return ret;
    }
  });

  var HubInvitationCollection = Backbone.Collection.extend({
    url: "/users/me/hubinvitations",
    model: HubInvitationModel
  });

  module.exports = HubInvitationCollection;

}())
