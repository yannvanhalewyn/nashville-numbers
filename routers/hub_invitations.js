(function() {

  "use strict";

  var HubInvitationsRouter = require('express').Router()
    , Controller = require('../controllers/hub_invitations_controller')

  HubInvitationsRouter.get('/', Controller.index);
  HubInvitationsRouter.get('/:invitation_id', Controller.show);
  HubInvitationsRouter.post('/', Controller.create);
  HubInvitationsRouter.put('/:invitation_id', Controller.update);
  HubInvitationsRouter.delete('/:invitation_id', Controller.destroy);

  module.exports = HubInvitationsRouter;

}())
