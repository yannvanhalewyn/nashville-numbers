(function() {

  "use strict";

  var FriendsRouter = require('express').Router({mergeParams: true});

  var FriendsController = require('../controllers/friends/friends_controller')
    , middlewares = FriendsController.middlewares

  FriendsRouter.get('/', middlewares.index, FriendsController.index);
  FriendsRouter.get('/:friend_id', middlewares.show, FriendsController.show);
  FriendsRouter.delete('/:friend_id', middlewares.destroy, FriendsController.destroy);

  module.exports = FriendsRouter;

}())
