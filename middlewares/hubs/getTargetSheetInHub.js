(function() {

  "use strict";

  /**
   * Gets the sheet connected to the target hub that has an _id of params.sheet_id.
   * It stores the sheet as req.target_sheet_in_hub.
   * It calls next with error if hub.getSheet throws.
   *
   */
  var getTargetSheetInHub = function(req, res, next) {
    req.target_hub.getSheet(req.params.sheet_id).then(function(sheet) {
      req.target_sheet_in_hub = sheet;
      next();
    }, function(error) {
      next(error);
    });
  }

  module.exports = getTargetSheetInHub;

}())
