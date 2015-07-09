// GET    /user/1/friends           -- Shows all friends
// POST   /user/1/friends           -- CREATES a new friend relationship
// DELETE /users/1/friends/:otherID -- DELETES THE FRIEND REQUEST

(function() {

  "use strict";

  var include = require('include')
    , mongoose = require('mongoose')

  var FriendController = {

    index: function(req, res, next) {
      return req.user.getFriends().exec()
      .then(function(friends) {
        res.render('friends', {friends: friends});
      });
    }
  };

  module.exports = FriendController;

}())
