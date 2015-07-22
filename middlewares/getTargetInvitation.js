(function() {

  "use strict";

  var HubInvitation = require('../models/hub_invitation');

  var getTargetInvitation = {

    sentByLoggedInUser: function(req, res, next) {
      HubInvitation.findByIdAndSentBy(req.params.invitation_id, req.user._id)
      .then(function(invitation) {
        req.target_invitation = invitation;
        next();
      }, function(error) {
        res.status(401);
        res.send(error);
      });
    }
  }

  module.exports = getTargetInvitation;

}())
