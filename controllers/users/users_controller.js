(function() {

  "use strict";

  var include       = require('include')
    , User          = include('/models/user')
    , ensureAuth    = include('/middlewares/auth')
    , getTargetUser = include('/middlewares/users/getTargetUser')
    , getMeAsUser   = include('/middlewares/users/getMeAsUser')
    , _             = require('lodash')

  var UsersController = {

    middlewares: {
      index:    [],
      showMe:   [ensureAuth, getMeAsUser],
      showUser: [ensureAuth, getTargetUser]
    },

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
