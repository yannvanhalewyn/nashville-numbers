(function() {

  "use strict";

  var FriendRequestsRouter = require('express').Router({mergeParams: true});
  var ensureAuth = require('../middlewares/auth');

  var FriendRequestsController = require('../controllers/friend_requests_controller');

  FriendRequestsRouter.post('/', ensureAuth, FriendRequestsController.create)

  module.exports = FriendRequestsRouter;

}())
