(function() {

  "use strict";

  var Backbone = require('backbone')
    , HubInvitationCollection = require('../models/hubinvitations')
    , Dispatcher = require('../../dispatcher/generic_dispatcher')
    , Constants = require('../actions/hubActions').constants

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
      this.invitations.on('destroy', this.trigger.bind(this, 'invitations:destroy'));
      this.invitations.fetch();

      // Register the dispatcher
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this));
    },

    dispatchCallback: function(payload) {
      switch (payload.actionType) {
        case Constants.ACCEPT_HUB_INVITATION:
          console.log("ACCEPT");
          var invitation = this.invitations.get(payload.cid);
          invitation.destroy({contentType: "application/json", data: JSON.stringify({accept: true})});
          break;

        case Constants.DECLINE_HUB_INVITATION:
          var invitation = this.invitations.get(payload.cid);
          invitation.destroy();
          break;

        default:
          console.error("No such action - " + payload.actionType);
      }
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
          var object = invitation.attributes;
          object.cid = invitation.cid;
          return object;
        })
      };
    }
  });

  module.exports = new HubCollection();

}())
