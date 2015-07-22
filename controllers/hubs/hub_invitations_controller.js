(function() {

  var include             = require('include')
    , ensureAuth          = include('/middlewares/auth')
    , getTargetHub        = include('/middlewares/getTargetHub')
    , getTargetInvitation = include('/middlewares/getTargetInvitation')

  module.exports = {

    middlewares: {
      index:   [ensureAuth, getTargetHub],
      create:  [ensureAuth],
      update:  [ensureAuth, getTargetInvitation.sentByLoggedInUser],
      destroy: [ensureAuth]
    },

    index: function(req, res) {
      req.target_hub.getInvitations().then(function(invitations) {
        res.json(invitations);
      });
    },

    create: function(req, res) {
      req.user.inviteToHub(req.params.hub_id, req.body.other_user_id, req.body.permissions)
      .then(function(invitation) {
        res.json(invitation);
      });
    },

    update: function(req, res) {
      // Attempt to update the invitation's permissions
      req.target_invitation.setPermissionValue(req.body.permissions)

      // On success send the updated invitation as json
      .then(function(updated_invitation) {
        res.json(updated_invitation);

      // On error send a 400 (bad request) and the error message)
      }).catch(function(error) {
        res.status(400);
        res.send(error);
      });
    },

    destroy: function(req, res) {
      req.user.destroyHubInvitation(req.params.invitation_id).then(function() {
        res.json({destroyed: true});
      }, function(err) {
        res.status(401);
        res.send(err);
      });
    }
  };

}())
