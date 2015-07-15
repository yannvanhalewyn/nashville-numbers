(function() {

  "use strict";

  var FriendRequestsController = {
    index: function(req, res) {
      req.user.getOpenFriendRequests().then(function(requests) {
        res.json(requests);
      });
    },

    create: function(req, res) {
      req.user.sendFriendRequest(req.body.other_user_id).then(function(request) {
        res.json({type: 'sent', request: request});
      });
    },

    update: function(req, res) {
      req.user.acceptFriendRequest(req.params.request_id).then(function(relationship) {
        res.json({type: 'accepted', relationship: relationship});
      });
    }
  }

  module.exports = FriendRequestsController;

}())
