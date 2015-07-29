(function() {

  "use strict";

  var include               = require('include')
    , HubParticipantsRouter = require('express').Router({mergeParams: true})
    , Controller            = include('/controllers/hubs/hub_participants_controller')
    , middlewares           = Controller.middlewares

  HubParticipantsRouter.get('/', middlewares.index, Controller.index);
  HubParticipantsRouter.put('/:participant_id', middlewares.update, Controller.update);
  HubParticipantsRouter.delete('/me', middlewares.leave, Controller.leave);
  HubParticipantsRouter.delete('/:participant_id', middlewares.destroy, Controller.destroy);


  module.exports = HubParticipantsRouter;

}())
