(function() {

  "use strict";

  var Backbone = require('backbone')
    , HubInvitationCollection = require('../models/hubinvitations')

  var HubModel = Backbone.Model.extend({
    idAttribute: "_id",
  });

  var HubCollection = Backbone.Collection.extend({
    model: HubModel,
    url: "/hubs/",

    initialize: function() {
      // Parse the hubs json state
      var jsonState = document.getElementById('initial_state').text;
      var hubs = JSON.parse(jsonState);
      // Create a new model for every hub
      hubs.forEach(function(e) {
        var hub = new HubModel(e.hub);
        hub.relation = e.relation;
        this.add(hub);
      }.bind(this))

      // Set a hubinvitations nested resource
      this.invitations = new HubInvitationCollection();
      this.invitations.on('sync', this.trigger.bind(this, 'invitations:sync'));
      this.invitations.fetch();
    },

    getState: function() {
      return {
        hubs: this.models.map(function(m) {
          return {
            _id: m.attributes._id,
            properties: m.attributes.properties,
            relation: m.relation
          }
        }),
        invitations: this.invitations.models.map(function(invitation) {
          return invitation.attributes;
        })
      };
    }
  });

  module.exports = new HubCollection();

}())
