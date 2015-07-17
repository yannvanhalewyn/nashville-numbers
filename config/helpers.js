(function() {

  "use strict";

  var Helpers = function(app) {
    app.use(function(req, res, next) {
      app.locals.logged_in_user = req.user;
      next();
    });
  };

  module.exports = Helpers;

}())
