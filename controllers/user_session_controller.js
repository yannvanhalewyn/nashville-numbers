(function() {

  "use strict";

  var config = require('../config');
  var passport = require('passport');
  var User = require('../models/user');

  var UserSessionController = {

    // LOGOUT
    logout: function(req, res) {
      req.logout();
      res.redirect('/home');
    },

    // LOGIN
    newFacebookSession: passport.authenticate('facebook'),

    // LOGIN-callback from provider
    oauthCallback: function(provider) {
      return function(req, res, next) {
        passport.authenticate(provider, function(err, user, redirectURL) {
          if (err || !user) {
            console.log("ERROR in user session controller, redirecting to /signin");
            return res.redirect('/home')
          }
          req.login(user, function(err) {
            if (err) {
              console.log("ERROR logging in, redirecting to /signin");
              return res.redirect('/home')
            }
            return res.redirect(redirectURL || '/dashboard')
          })
        })(req, res, next);
      }
    }
  }

  module.exports = UserSessionController;

}())
