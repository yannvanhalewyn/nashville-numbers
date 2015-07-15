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
      return req.user.getFriendship(req.target_user._id).then(function(friendship) {
        var state = _.assign({}, req.target_user, {friendship: friendship});
        res.render('user', {state: JSON.stringify(state)});
      });
    }
  }

  module.exports = UsersController;

}())
