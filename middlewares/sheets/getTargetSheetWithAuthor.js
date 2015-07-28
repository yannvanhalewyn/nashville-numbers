(function() {

  "use strict";

  var include = require('include')
    , Sheet = include('/models/sheet');

  /**
   * Attempts to find the sheet whose _id is the req.params.sheet_id. If found:
   * req.target_sheet will equal an instance of Sheet representing the sheet.
   * req.target_sheet_author will equal an instance of user representing the
   * author of the sheet.
   *
   * If non is found, the response will be redirected to the logged in users
   * sheets page.
   *
   */
  var getTargetSheetWithAuthor = function(req, res, next) {
    Sheet.findByIdWithAuthor(req.params.sheet_id).then(function(result) {
      req.target_sheet = result.sheet;
      req.target_sheet_author = result.author;
      next();
    }, function(error) {
      res.redirect("/users/me/sheets");
    });
  }

  module.exports = getTargetSheetWithAuthor;

}())
