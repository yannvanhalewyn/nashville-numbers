(function() {

  "use strict";

  var UsersController = {
    index: function(req, res) {
      res.send("Users index page.")
    },

    show: function(req, res) {
      res.send("User " + req.params.user_id + " page.")
    }
  }

  module.exports = UsersController;

}())
