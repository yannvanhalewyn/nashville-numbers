(function() {

  "use strict";

  var include         = require('include')
    , HubSheetsRouter = require('express').Router({mergeParams: true})
    , Controller      = include('/controllers/hub_sheets_controller');

  HubSheetsRouter.get('/', Controller.index);
  HubSheetsRouter.get('/:sheet_id', Controller.show);
  HubSheetsRouter.post('/', Controller.create);
  HubSheetsRouter.delete('/:participant_id', Controller.destroy);

  module.exports = HubSheetsRouter;

}())
