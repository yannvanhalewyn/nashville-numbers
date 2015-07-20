(function() {

  "use strict";

  var Backbone = require('backbone')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')
    , Constants = require('../actions/hubpageActions').constants
    , ParticipantCollection = require('../models/participantCollection')
    , InvitationCollection = require('../models/invitationCollection')
    , FriendsCollection = require('../models/friendsCollection')

  var HubStore = Backbone.Model.extend({
    urlRoot: '/hubs',

    idAttribute: "_id",

    initialize: function() {
      // Get and set initial state from hidden script field
      var jsonState = document.getElementById('initial_state').innerHTML;
      this.set(JSON.parse(jsonState));

      // Register dispatchcallback
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this));

      // Set the participants collection as nested resource
      this.participants = new ParticipantCollection({hubID: this.id});
      this.participants.on('sync', this.trigger.bind(this, 'participants:sync'));
      this.participants.fetch();

      // Set the invitations collection as nested resource
      this.invitations = new InvitationCollection({hubID: this.id});
      this.invitations.on('sync', this.trigger.bind(this, 'invitations:sync'));

      // Set the friendsCollection as nestedResource
      this.friends = new FriendsCollection();
      this.friends.on('sync', this.trigger.bind(this, 'friends:sync'));
    },

    dispatchCallback: function(payload) {
      switch (payload.actionType) {
        case Constants.UPDATE_FRIENDS_LIST:
          if (payload.query.length >= 2) {
            this.friends.fetch({data: {search: payload.query}});
          }
          break;
        case Constants.INVITE_FRIEND:
          this.invitations.create({other_user_id: payload.friendID});
          break;

        default:
          console.error("Invalid actiontype: " + payload.actionType);
          break;
      }
    }
  });

  module.exports = new HubStore();

}())
