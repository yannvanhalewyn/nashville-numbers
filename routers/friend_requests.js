(function() {

  "use strict";

  var FriendRequestsRouter     = require('express').Router({mergeParams: true})
    , FriendRequestsController = require('../controllers/friends/friend_requests_controller')
    , middlewares              = FriendRequestsController.middlewares

  FriendRequestsRouter.get('/', middlewares.index, FriendRequestsController.index)
  FriendRequestsRouter.post('/', middlewares.create, FriendRequestsController.create)
  FriendRequestsRouter.put('/:request_id', middlewares.update, FriendRequestsController.update)
  FriendRequestsRouter.delete('/:request_id', middlewares.destroy, FriendRequestsController.destroy)

  module.exports = FriendRequestsRouter;

}())
