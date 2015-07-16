(function() {

  "use strict";

  var getMeAsUser = function(req, res, next) {
    req.target_user = req.user;
    next();
  }

  module.exports = getMeAsUser;

}())
