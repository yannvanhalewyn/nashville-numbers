(function() {

  "use strict";

  var FriendsRouter = require('express').Router({mergeParams: true});
  var ensureAuth = require('../middlewares/auth');

  var FriendsController = require('../controllers/friends/friends_controller');

  FriendsRouter.get('/', ensureAuth, FriendsController.index);
  FriendsRouter.get('/:friend_id', ensureAuth, FriendsController.show);
  FriendsRouter.delete('/:friend_id', ensureAuth, FriendsController.destroy);

  module.exports = FriendsRouter;

}())
