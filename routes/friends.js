(function() {

  "use strict";

  var FriendsRouter = require('express').Router({mergeParams: true});
  var ensureAuth = require('../middlewares/auth');

  var FriendsController = require('../controllers/friends_controller');

  FriendsRouter.get('/', ensureAuth, FriendsController.index);

  module.exports = FriendsRouter;

}())
