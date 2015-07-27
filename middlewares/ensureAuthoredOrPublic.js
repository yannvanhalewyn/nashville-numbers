(function() {

  "use strict";

  /**
   * Checks if the target sheet is public. If not, it checks if the logged in
   * user is the sheet's author. If not it redirects to the logged in user's
   * sheet page.
   *
   */
  var ensureAuthoredOrPublic = function(req, res, next) {
    if (req.target_sheet.properties.public) return next();
    if (req.target_sheet_author._id == req.user._id) return next();
    res.redirect("/users/me/sheets");
  };

  module.exports = ensureAuthoredOrPublic;

}())
