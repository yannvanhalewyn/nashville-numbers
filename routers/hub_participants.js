(function() {

  "use strict";

  var include               = require('include')
    , HubParticipantsRouter = require('express').Router({mergeParams: true})
    , Controller            = include('/controllers/hub_participants_controller')

  HubParticipantsRouter.get('/', Controller.index);
  HubParticipantsRouter.post('/', Controller.create);
  HubParticipantsRouter.put('/:participant_id', Controller.update);
  HubParticipantsRouter.delete('/:participant_id', Controller.destroy);

  module.exports = HubParticipantsRouter;

}())
