(function() {

  "use strict";

  var User = require('../models/user')
    , _    = require('lodash')

  var UsersController = {
    index: function(req, res) {
      User.findByName(req.query.search).then(function(foundUsers) {
        res.json(foundUsers);
      })
    },

    show: function(req, res) {
      res.render('user', { state: JSON.stringify(req.target_user) });
    }
  }

  module.exports = UsersController;

}())
