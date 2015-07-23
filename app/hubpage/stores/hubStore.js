(function() {

  "use strict";

  var Backbone = require('backbone')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')
    , Constants = require('../actions/hubpageActions').constants
    , ParticipantCollection = require('../models/participantCollection')
    , InvitationCollection = require('../models/invitationCollection')
    , FriendsCollection = require('../models/friendsCollection')

  // Temporary until finished up the hub-settings.
  var DEFAULT_PERMISSIONS = require('../../../models/permission').Ranks.citizen;

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
      this.invitations.on('destroy', this.trigger.bind(this, 'invitations:destroy'));
      this.invitations.fetch(); // TODO only fetch when management modal pops

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
          this.invitations.create({
            other_user_id: payload.friendID, permissions: DEFAULT_PERMISSIONS
          });
          break;

        case Constants.CANCEL_INVITATION:
          var invitation = this.invitations.get(payload.cid)
          invitation.destroy();
          break;

        case Constants.UPDATE_INVITED_USER_PERMISSIONS:
          var invitation = this.invitations.get(payload.cid);
          invitation.save({permissions: payload.value});
          break;

        default:
          console.error("Invalid actiontype: " + payload.actionType);
          break;
      }
    },

    // TODO: clean up filtering, I dislike the fact that I'm handling and
    // sending live mutable data into the react tree. Find a way to get all
    // model attributes in a collection as Immutable data, maybe use
    // ImmutableJS?
    getState: function() {
      // Invitations are all atributes on all models in the invitations collection
      var invitations = this.invitations.models.map(function(invitation) {
        var obj = invitation.attributes;
        obj.cid = invitation.cid;
        return obj;
      });

      // Filter friends suggestions list to friends no yet invited
      var friends = this.friends.models.filter(function(friend) {
        for (var i in invitations) {
          if (invitations[i].invitee._id == friend.attributes._id) {
            return false;
          }
        }
        return true;
      // Return all those friends's attributes
      }).map(function(friend) {
        return friend.attributes;
      });

      // Return the state
      return {
        invitations: invitations,
        friends: friends,
        hub: this.attributes
      }
    }
  });

  module.exports = new HubStore();

}())
