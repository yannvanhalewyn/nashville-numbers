(function() {

  "use strict";

  var SheetsController = require('../controllers/sheets_controller')
    , ensureAuth = require('../middlewares/auth');

  var SheetsRouter = require('express').Router({mergeParams: true});

  SheetsRouter.get('/', ensureAuth, SheetsController.index);

  module.exports = SheetsRouter;

}())
