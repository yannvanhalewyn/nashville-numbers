(function() {

  "use strict";

  var Controller = require('../controllers/sheets_controller')
    , middlewares = Controller.middlewares
    , ensureAuth = require('../middlewares/auth');

  var SheetsRouter = require('express').Router({mergeParams: true});

  SheetsRouter.get('/', middlewares.index, Controller.index);
  SheetsRouter.get('/:sheet_id/edit', middlewares.edit, Controller.edit);
  SheetsRouter.post('/', middlewares.create, Controller.create);
  SheetsRouter.put('/:sheet_id', middlewares.update, Controller.update);
  SheetsRouter.delete('/:sheet_id', middlewares.destroy, Controller.destroy);

  module.exports = SheetsRouter;

}())
