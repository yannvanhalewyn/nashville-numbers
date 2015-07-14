(function() {

  "use strict";

  var User = require('../models/user');

  var UsersController = {
    index: function(req, res) {
      User.findByName(req.query.search).then(function(foundUsers) {
        res.json(foundUsers);
      })
    },

    show: function(req, res) {
      res.send("User " + req.params.user_id + " page.")
    }
  }

  module.exports = UsersController;

}())
