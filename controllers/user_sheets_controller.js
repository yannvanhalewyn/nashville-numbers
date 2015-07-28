(function() {

  var include              = require('include')
    , ensureAuth           = include('/middlewares/auth')
    , getTargetUser        = include('/middlewares/users/getTargetUser')
    , getMeAsUser          = include('/middlewares/users/getMeAsUser')
    , getTargetUsersSheets = include('/middlewares/users/getTargetUsersSheets')

  module.exports = {

    middlewares: {
      index:   [ensureAuth, getTargetUser, getTargetUsersSheets],
      indexMe: [ensureAuth, getMeAsUser, getTargetUsersSheets]
    },

    index: function(req, res) {
      res.json(req.target_user_sheets);
    },

    indexMe: function(req, res) {
      res.render("sheets", {active_sheets: true, sheets: req.target_user_sheets});
    }
  };

}())
