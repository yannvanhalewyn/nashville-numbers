(function() {

  "use strict";

  var UsersController = require('../controllers/users_controller');

  var UsersRouter = require('express').Router();

  UsersRouter.get('/', UsersController.index);
  UsersRouter.get('/:user_id', UsersController.show);

  module.exports = UsersRouter;

}())
