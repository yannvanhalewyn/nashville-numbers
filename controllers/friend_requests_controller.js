(function() {

  "use strict";

  var FriendRequestsController = {
    create: function(req, res) {
      req.user.sendFriendRequest(req.body.other_user_id).then(function() {
        res.sendStatus(200);
      });
    },

    update: function(req, res) {
      req.user.acceptFriendRequest(req.params.request_id).then(function() {
        res.sendStatus(200);
      });
    }
  }

  module.exports = FriendRequestsController;

}())
