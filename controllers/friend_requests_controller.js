(function() {

  "use strict";

  // TODO be semantic about not founds, not authorised etc.. Middleware?
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
    },

    destroy: function(req, res) {
      req.user.destroyFriendRequest(req.params.request_id).then(function() {
        res.json({type: "destroyed"});
      });
    }
  }

  module.exports = FriendRequestsController;

}())
