(function() {

  "use strict";

  var HubInvitationsRouter = require('express').Router({mergeParams: true})
    , Controller = require('../controllers/hubs/hub_invitations_controller')
    , getTargetHub = require('../middlewares/getTargetHub')

  HubInvitationsRouter.get('/', getTargetHub, Controller.index);
  HubInvitationsRouter.get('/:invitation_id', Controller.show);
  HubInvitationsRouter.post('/', Controller.create);
  HubInvitationsRouter.put('/:invitation_id', Controller.update);
  HubInvitationsRouter.delete('/:invitation_id', Controller.destroy);

  module.exports = HubInvitationsRouter;

}())
