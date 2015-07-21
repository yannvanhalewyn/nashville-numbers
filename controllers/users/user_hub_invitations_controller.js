(function() {

  var include    = require('include')
    , ensureAuth = include('/middlewares/auth')

  module.exports = {

    middlewares: {
      index:   [ensureAuth],
      destroy: [ensureAuth]
    },

    index: function(req, res) {
      req.user.getHubInvitations().then(function(invitations) {
        res.json(invitations);
      });
    },

    destroy: function(req, res) {
      // If body says to accept the invitation, accept it.
      if (req.body && req.body.accept) {
        req.user.acceptHubInvitation(req.params.invitation_id).then(function(relationship) {
          res.json(relationship);
        }, function(err) {
          res.status(401);
          res.send(err);
        });

      // If body says to decline the invitation (accept: false), destroy it
      } else {
        req.user.destroyHubInvitation(req.params.invitation_id).then(function() {
          res.json({destroyed: true});
        }, function(err) {
          res.status(401);
          res.send(err);
        });
      }
    }
  };

}())
