(function() {

  "use strict";

  var include = require('include')
    , HubsRouter     = require('express').Router()
    , HubsController = require('../controllers/hubs_controller')
    , getTargetHub = include('/middlewares/getTargetHub')

  HubsRouter.get('/', HubsController.index);
  HubsRouter.get('/:hub_id', getTargetHub, HubsController.show);
  HubsRouter.post('/', HubsController.create);
  HubsRouter.put('/:hub_id', getTargetHub, HubsController.update);
  HubsRouter.delete('/:hub_id', getTargetHub, HubsController.destroy);

  module.exports = HubsRouter;

}())

