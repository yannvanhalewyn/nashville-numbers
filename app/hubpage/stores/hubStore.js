(function() {

  "use strict";

  var Backbone = require('backbone')
    , ParticipantCollection = require('../models/participantCollection')

  var HubStore = Backbone.Model.extend({
    urlRoot: '/hubs',

    idAttribute: "_id",

    initialize: function() {
      // Get and set initial state from hidden script field
      var jsonState = document.getElementById('initial_state').innerHTML;
      this.set(JSON.parse(jsonState));

      // Set the participants collection as nested resource
      this.participants = new ParticipantCollection({hubID: this.id});
      this.participants.on('sync', this.trigger.bind(this, 'participants:sync'));
      this.participants.fetch();
    }
  });

  module.exports = new HubStore();

}())
