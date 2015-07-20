(function() {

  "use strict";

  var UsersController = require('../controllers/users_controller')
    , ensureAuth      = require('../middlewares/auth')
    , getTargetUser   = require('../middlewares/getTargetUser')
    , getMeAsUser   = require('../middlewares/getMeAsUser')

  var UsersRouter = require('express').Router();

  UsersRouter.get('/', UsersController.index);
  UsersRouter.get('/me', getMeAsUser, UsersController.show);
  UsersRouter.get('/:user_id', getTargetUser, UsersController.show);
  UsersRouter.get('/me/hubinvitations', getMeAsUser, UsersController.hubInvitations);

  module.exports = UsersRouter;

}())
