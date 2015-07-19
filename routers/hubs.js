(function() {

  "use strict";

  var HubsRouter     = require('express').Router()
    , HubsController = require('../controllers/hubs_controller')

  HubsRouter.get('/', HubsController.index);
  HubsRouter.get('/:hub_id', HubsController.show);
  HubsRouter.post('/', HubsController.create);
  HubsRouter.put('/:hub_id', HubsController.update);
  HubsRouter.delete('/:hub_id', HubsController.destroy);

  module.exports = HubsRouter;

}())

