(function() {

  "use strict";

  var Backbone = require('backbone');

  var InvitationModel = Backbone.Model.extend({});

  var InvitationCollection = Backbone.Collection.extend({
    model: InvitationModel,

    initialize: function(params) {
      this.url = "/hubs/" + params.hubID + "/invitations"
    },

  });

  module.exports = InvitationCollection;

}())
