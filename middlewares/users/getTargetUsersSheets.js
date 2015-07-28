(function() {

  "use strict";

  /**
   * Calls the sheets() method on the target user and stores the result as
   * req.target_user_sheets.
   *
   */
  var getTargetUsersSheets = function(req, res, next) {
    req.target_user.sheets().then(function(sheets) {
      req.target_user_sheets = sheets;
      next();
    });
  }

  module.exports = getTargetUsersSheets;

}())
