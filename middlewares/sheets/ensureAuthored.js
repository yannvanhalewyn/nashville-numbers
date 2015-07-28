(function() {

  "use strict";


  /**
   * Ensures the target sheet's author (req.target_sheet_author) was authored is
   * logged in user (req.user)
   *
   */
  var ensureAuthored = function(req, res, next) {
    if (req.user._id != req.target_sheet_author._id) {
      return res.redirect('/users/me/sheets');
    }
    next();
  }

  module.exports = ensureAuthored;

}())
