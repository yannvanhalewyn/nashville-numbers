(function() {

  var include    = require('include')
    , ensureAuth = include('/middlewares/auth')

  module.exports = {

    middlewares: {
      index:   [ensureAuth],
      update:  [ensureAuth],
      destroy: [ensureAuth]
    },

    index: function(req, res) {
      req.user.getHubInvitations().then(function(invitations) {
        res.json(invitations);
      });
    },

    update: function(req, res) {
      req.user.acceptHubInvitation(req.params.invitation_id).then(function(relationship) {
        res.json(relationship);
      }, function(err) {
        res.send(err);
      });
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.invitation_id);
    }
  };

}())
