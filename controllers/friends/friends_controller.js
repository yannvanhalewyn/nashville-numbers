// GET    /user/1/friends           -- Shows all friends
// POST   /user/1/friends           -- CREATES a new friend relationship
// DELETE /users/1/friends/:otherID -- DELETES THE FRIEND REQUEST

(function() {

  "use strict";

  var ensureAuth = require('../../middlewares/auth');

  var FriendController = {

    middlewares: {
      index:   [ensureAuth],
      show:    [ensureAuth],
      destroy: [ensureAuth]
    },

    index: function(req, res) {
      if (req.query && req.query.search) {
        req.user.findFriends(req.query.search).then(function(friends) {
          res.json(friends);
        });
      } else {
        res.render('friends');
      }
    },

    show: function(req, res) {
      req.user.getFriendship(req.params.friend_id).then(function(friendship) {
        res.json(friendship);
      });
    },

    destroy: function(req, res) {
      req.user.deleteFriend(req.params.friend_id).then(function() {
        res.json({type: 'destroyed'});
      });
    }
  };

  module.exports = FriendController;

}())
