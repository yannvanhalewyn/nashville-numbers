(function() {

  "use strict";

  var HubInvitationsRouter = require('express').Router({mergeParams: true})
    , Controller = require('../controllers/hubs/hub_invitations_controller')
    , middlewares = Controller.middlewares

  HubInvitationsRouter.get('/', middlewares.index, Controller.index);
  HubInvitationsRouter.post('/', middlewares.create, Controller.create);
  HubInvitationsRouter.delete('/:invitation_id', middlewares.destroy, Controller.destroy);

  module.exports = HubInvitationsRouter;

}())
