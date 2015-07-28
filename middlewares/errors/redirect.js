(function() {

  "use strict";

  var redirect = {
    sheets: function(err, req, res, next) {
      console.log("REDIRECT");
      res.redirect("/users/me/sheets");
    }
  }

  module.exports = redirect;

}())
