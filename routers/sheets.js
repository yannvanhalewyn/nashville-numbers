(function() {

  "use strict";

  var SheetsController = require('../controllers/sheets_controller')
    , ensureAuth = require('../middlewares/auth');

  var SheetsRouter = require('express').Router({mergeParams: true});

  SheetsRouter.get('/', ensureAuth, SheetsController.index);
  SheetsRouter.get('/:sheet_id/edit', ensureAuth, SheetsController.edit);
  SheetsRouter.post('/', ensureAuth, SheetsController.create);
  SheetsRouter.put('/:sheet_id', ensureAuth, SheetsController.update);
  SheetsRouter.delete('/:sheet_id', SheetsController.destroy);

  module.exports = SheetsRouter;

}())
