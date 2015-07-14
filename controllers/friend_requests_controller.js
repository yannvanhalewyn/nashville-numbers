(function() {

  "use strict";

  var FriendRequestsController = {
    create: function(req, res) {
      return req.user.sendFriendRequest(req.body.other_uid).then(function() {
        res.sendStatus(200);
      });
    }
  }

  module.exports = FriendRequestsController;

}())
