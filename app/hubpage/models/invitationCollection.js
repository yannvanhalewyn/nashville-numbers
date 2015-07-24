(function() {

  "use strict";

  var Backbone = require('backbone');

  var InvitationModel = Backbone.Model.extend({
    idAttribute: "_id",
    parse: function(res) {
      var obj = res.invitation;
      // When originally fetching the invitation, the invitee gets sent along.
      // When updating (permissions), only the updated invitation gets sent.
      if (res.invitee) {
        obj.invitee = res.invitee;
      }
      return obj;
    }
  });

  var InvitationCollection = Backbone.Collection.extend({
    model: InvitationModel,

    // Models is not used, I need access to the passed in params to store the
    // parent hubID
    initialize: function(models, params) {
      this.url = "/hubs/" + params.hubID + "/invitations"
    },

  });

  module.exports = InvitationCollection;

}())
