(function() {

  "use strict";

  var include         = require('include')
    , HubSheetsRouter = require('express').Router({mergeParams: true})
    , Controller      = include('/controllers/hubs/hub_sheets_controller')
    , middlewares     = Controller.middlewares

  HubSheetsRouter.get('/', middlewares.index, Controller.index);
  HubSheetsRouter.get('/:sheet_id', middlewares.show, Controller.show);
  HubSheetsRouter.post('/', middlewares.create, Controller.create);
  HubSheetsRouter.delete('/:participant_id', middlewares.destroy, Controller.destroy);

  module.exports = HubSheetsRouter;

}())
