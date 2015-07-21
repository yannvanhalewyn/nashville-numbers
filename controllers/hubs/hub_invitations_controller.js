(function() {

  var include      = require('include')
    , ensureAuth   = include('/middlewares/auth')
    , getTargetHub = include('/middlewares/getTargetHub')

  module.exports = {

    middlewares: {
      index:   [ensureAuth, getTargetHub],
      create:  [ensureAuth],
      destroy: [ensureAuth]
    },

    index: function(req, res) {
      req.target_hub.getInvitations().then(function(invitations) {
        res.json(invitations);
      });
    },

    create: function(req, res) {
      req.user.inviteToHub(req.params.hub_id, req.body.other_user_id).then(function(invitation) {
        res.json(invitation);
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
