(function() {

  "use strict";

  var include = require('include')
    , User = include('/models/user');

  var getTargetUser = function(req, res, next) {
    return User.findById(req.params.user_id).then(function(user) {
      req.target_user = user;
      next();
    }, function(err) {
      res.redirect('/');
    });
  };

  module.exports = getTargetUser;

}())
