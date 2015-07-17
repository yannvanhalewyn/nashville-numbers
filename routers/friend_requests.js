(function() {

  "use strict";

  var FriendRequestsRouter = require('express').Router({mergeParams: true});
  var ensureAuth = require('../middlewares/auth');

  var FriendRequestsController = require('../controllers/friend_requests_controller');

  FriendRequestsRouter.get('/', ensureAuth, FriendRequestsController.index)
  FriendRequestsRouter.post('/', ensureAuth, FriendRequestsController.create)
  FriendRequestsRouter.put('/:request_id', ensureAuth, FriendRequestsController.update)
  FriendRequestsRouter.delete('/:request_id', ensureAuth, FriendRequestsController.destroy)

  module.exports = FriendRequestsRouter;

}())
