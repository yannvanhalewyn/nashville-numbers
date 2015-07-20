(function() {

  "use strict";

  var Backbone = require('backbone');

  var HubInvitationModel = Backbone.Model.extend({});

  var HubInvitationCollection = Backbone.Collection.extend({
    url: "/users/me/hubinvitations",
    model: HubInvitationModel
  });

  module.exports = HubInvitationCollection;

}())
