(function() {

  "use strict";

  var include = require('include')
    , HubInvitation = include('/models/hub_invitation');

  var getTargetInvitation = {


    /**
     * Finds and stores the target invitation IF the logged in user is the sender.
     *
     * When found the target invitation is stored as req.target_invitation
     * When not a unauthorized is sent (401) with the error.
     */
    sentByLoggedInUser: function(req, res, next) {
      // Find the invitation NOTE the ..sentBY
      HubInvitation.findByIdAndSentBy(req.params.invitation_id, req.user._id)

      // If found, store it
      .then(function(invitation) {
        req.target_invitation = invitation;
        next();

      // If not (findById throws an error when not found) send a 401
      }, function(error) {
        res.status(401);
        res.send(error);
      });
    },

    /**
     * Finds and stores the target invitation IF the logged in user is the receiver.
     *
     * When found the target invitation is stored as req.target_invitation
     * When not a unauthorized is sent (401) with the error.
     */
    sentToLoggedInUser: function(req, res, next) {
      // Find the invitation NOTE the ..sentTO
      HubInvitation.findByIdAndSentTo(req.params.invitation_id, req.user._id)

      // If found, store it
      .then(function(invitation) {
        req.target_invitation = invitation;
        next();

      // If not (throws an error when not found) send a 401.
      }, function(error) {
        res.status(401);
        res.send(error);
      });
    }
  }

  module.exports = getTargetInvitation;

}())
