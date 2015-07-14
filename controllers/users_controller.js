(function() {

  "use strict";

  var UsersController = {
    index: function(req, res) {
      res.json([
        {_id: 1, attributes: {firstName: "Jean"}}, 
        {_id: 2, attributes: {firstName: "Bob"}},
      ]);
    },

    show: function(req, res) {
      res.send("User " + req.params.user_id + " page.")
    }
  }

  module.exports = UsersController;

}())
