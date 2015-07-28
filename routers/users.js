(function() {

  "use strict";

  var UsersRouter     = require('express').Router()
    , UsersController = require('../controllers/users/users_controller')
    , middlewares     = UsersController.middlewares

  UsersRouter.get('/', middlewares.index, UsersController.index);
  UsersRouter.get('/me', middlewares.showMe, UsersController.show);
  UsersRouter.get('/:user_id', middlewares.showUser, UsersController.show);


  // Nested sheets
  var UserSheetsController = require('../controllers/user_sheets_controller')
    , userSheetsMiddlewares = UserSheetsController.middlewares;

  UsersRouter.get('/me/sheets', userSheetsMiddlewares.indexMe, UserSheetsController.indexMe);
  UsersRouter.get('/:user_id/sheets', userSheetsMiddlewares.index, UserSheetsController.index);

  module.exports = UsersRouter;

}())
