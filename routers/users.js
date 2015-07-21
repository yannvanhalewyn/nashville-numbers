(function() {

  "use strict";

  var UsersRouter     = require('express').Router()
    , UsersController = require('../controllers/users/users_controller')
    , middlewares     = UsersController.middlewares

  UsersRouter.get('/', middlewares.index, UsersController.index);
  UsersRouter.get('/me', middlewares.showMe, UsersController.show);
  UsersRouter.get('/:user_id', middlewares.showUser, UsersController.show);

  module.exports = UsersRouter;

}())
