(function() {

  "use strict";

  var EnsureAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/home');
    }
    return next();
  };

  module.exports = EnsureAuth;

}())
