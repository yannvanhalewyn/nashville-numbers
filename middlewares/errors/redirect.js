(function() {

  "use strict";

  var redirect = {
    sheets: function(err, req, res, next) {
      res.redirect("/users/me/sheets");
    }
  }

  module.exports = redirect;

}())
