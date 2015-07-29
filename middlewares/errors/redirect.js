(function() {

  "use strict";

  var redirect = {
    sheets: function(err, req, res, next) {
      res.redirect("/users/me/sheets");
    },

    hub: function(err, req, res, next) {
      res.redirect("/hubs/" + req.params.hub_id);
    }
  }

  module.exports = redirect;

}())
