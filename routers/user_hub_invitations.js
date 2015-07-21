(function() {

  "use strict";

  var UserHubInvitationsRouter = require('express').Router()
    , Controller = require('../controllers/users/user_hub_invitations_controller')
    , middlewares = Controller.middlewares

  UserHubInvitationsRouter.get('/', middlewares.index, Controller.index);
  UserHubInvitationsRouter.put('/:invitation_id', middlewares.update, Controller.update); // Accepts it
  UserHubInvitationsRouter.delete('/:invitation_id', middlewares.destroy, Controller.destroy); // Declines it

  module.exports = UserHubInvitationsRouter;

}())
