(function() {

  "use strict";

  var include        = require('include')
    , HubsRouter     = require('express').Router()
    , HubsController = require('../controllers/hubs/hubs_controller')
    , middlewares    = HubsController.middlewares

  HubsRouter.get('/', middlewares.index, HubsController.index);
  HubsRouter.get('/:hub_id', middlewares.show, HubsController.show);
  HubsRouter.post('/', middlewares.create, HubsController.create);
  HubsRouter.put('/:hub_id', middlewares.update, HubsController.update);
  HubsRouter.delete('/:hub_id', middlewares.destroy, HubsController.destroy);

  module.exports = HubsRouter;

}())

