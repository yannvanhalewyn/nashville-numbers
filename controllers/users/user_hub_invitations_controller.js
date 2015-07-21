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
      res.send("UPDATE " + req.params.invitation_id);
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.invitation_id);
    }
  };

}())
