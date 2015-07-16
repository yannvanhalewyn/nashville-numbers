// GET    /user/1/friends           -- Shows all friends
// POST   /user/1/friends           -- CREATES a new friend relationship
// DELETE /users/1/friends/:otherID -- DELETES THE FRIEND REQUEST

(function() {

  "use strict";

  var FriendController = {

    index: function(req, res) {
      res.render('friends');
    },

    destroy: function(req, res) {
      req.user.deleteFriend(req.params.friend_id).then(function() {
        res.json({type: 'destroyed'});
      });
    }
  };

  module.exports = FriendController;

}())
