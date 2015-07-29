(function() {

  "use strict";

  var Backbone = require('backbone')
    , Dispatcher = require('../dispatchers/hubpageDispatcher')
    , Constants = require('../actions/hubpageActions').constants
    , ParticipantCollection = require('../models/participantCollection')
    , InvitationCollection = require('../models/invitationCollection')
    , FriendsCollection = require('../models/friendsCollection')
    , UsersSheetsCollection = require('../models/usersSheetsCollection')
    , HubSheetsCollection = require('../models/hubSheetsCollection')

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
      this.participants.on('destroy', this.trigger.bind(this, 'participants:destroy'));
      this.participants.fetch();

      // Set the invitations collection as nested resource
      this.invitations = new InvitationCollection([], {hubID: this.id});
      this.invitations.on('sync', this.trigger.bind(this, 'invitations:sync'));
      this.invitations.on('destroy', this.trigger.bind(this, 'invitations:destroy'));
      this.invitations.fetch(); // TODO only fetch when management modal pops

      // Set the friendsCollection as nestedResource
      this.friends = new FriendsCollection();
      this.friends.on('sync', this.trigger.bind(this, 'friends:sync'));

      // Set the user's sheets collection
      this.usersSheets = new UsersSheetsCollection();
      this.usersSheets.on('sync', this.trigger.bind(this, 'users-sheets:sync'));

      // Set the hub's sheets collection
      this.hubSheets = new HubSheetsCollection([], {hubID: this.id});
      this.hubSheets.on('sync', this.trigger.bind(this, 'hub-sheets:sync'));
      this.hubSheets.on('destroy', this.trigger.bind(this, 'hub-sheets:destroy'));
      this.hubSheets.fetch();
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
          this.invitations.get(payload._id).destroy();
          break;

        case Constants.UPDATE_INVITED_USER_PERMISSIONS:
          this.invitations.get(payload._id).save({permissions: payload.value});
          break;

        case Constants.REMOVE_PARTICIPANT:
          this.participants.get(payload._id).destroy();
          break;

        case Constants.SHOW_CONFIRMATION_MODAL:
          delete payload.actionType;
          this.trigger('modal-confirm', payload);
          break;

        case Constants.FETCH_USERS_SHEETS:
          if (!this.fetched) {
            this.usersSheets.fetch();
            this.fetched = true;
          }
          break;

        case Constants.ADD_SHEET_TO_HUB:
          this.hubSheets.create({sheet_id: payload.dbid});
          break;

        case Constants.REMOVE_SHEET_FROM_HUB:
          this.hubSheets.get(payload._id).destroy();
          break;

        default:
          console.error("Invalid actiontype: " + payload.actionType);
          break;
      }
    },

    getState: function() {
      return this.toJSON();
    },

    getParticipantsState: function() {
      var friends = this.friends.toJSON()
                      .filter(this._isNotParticipant.bind(this))
                      .filter(this._isNotInvited.bind(this));

      // Return the state
      return {
        invitations: this.invitations.toJSON(),
        participants: this.participants.toJSON(),
        friends: friends,
      }
    },

    getSheetsState: function() {
      return {
        usersSheets: this.usersSheets.toJSON().filter(this._isNotInHub.bind(this)),
        sheets: this.hubSheets.toJSON()
      }
    },

    // Filter functions
    _isInvited: function(user) {
      return this.invitations.toJSON().some(function(invitation) {
        return invitation.invitee._id == user._id;
      });
    },

    _isParticipant: function(user) {
      return this.participants.get(user._id) ? true : false;
    },

    _isInHub: function(sheet) {
      return this.hubSheets.get(sheet._id);
    },

    // Pretty annoying JS doesn't offer the Array.p.pick() method. I found it
    // unsemantic and hard to read to directly implement 'is not xxx'.
    _isNotInvited: function(user) { return !this._isInvited(user); },
    _isNotParticipant: function(user) { return !this._isParticipant(user); },
    _isNotInHub: function(sheet) { return !this._isInHub(sheet); }

  });

  module.exports = new HubStore();

}())
