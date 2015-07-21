(function() {

  var include      = require('include')
    , getTargetHub = include('/middlewares/getTargetHub')

  module.exports = {

    middlewares: {
      index:   [getTargetHub],
      show:    [],
      create:  [],
      update:  [],
      destroy: []
    },

    index: function(req, res) {
      req.target_hub.getInvitations().then(function(invitations) {
        res.json(invitations);
      });
    },

    show: function(req, res) {
      res.send("Show " + req.params.invitation_id)
    },

    create: function(req, res) {
      req.user.inviteToHub(req.params.hub_id, req.body.other_user_id).then(function(invitation) {
        res.json(invitation);
      });
    },

    update: function(req, res) {
      res.send("UPDATE " + req.params.invitation_id);
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.invitation_id);
    }
  };

}())
