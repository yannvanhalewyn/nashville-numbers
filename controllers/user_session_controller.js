(function() {

  var config = require('../config');
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;
  var User = require('../models/user');

  // Setup passport strategy
  passport.use(new FacebookStrategy(
    config.facebook, function(accessToken, refreshToken, profile, done) {
      // Verification (aka store the profile or get an existing one)
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;
      User.registerFacebookUser({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.name.displayName,
        userName: profile.username,
        picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user.png',
        provider: 'facebook',
        provider_id: profile.id,
        providerData: providerData
      }, done);
    }
  ));

  // The controller
  var UserSessionController = {

    logout: function(req, res) {
      req.logout();
      res.redirect('/home');
    },

    newFacebookSession: passport.authenticate('facebook'),

    oauthCallback: function(provider) {
      return function(req, res, next) {
        passport.authenticate(provider, function(err, user, redirectURL) {
          if (err || !user) {
            console.log("ERROR in user session controller, redirecting to /signin");
            return res.redirect('/signin')
          }
          req.login(user, function(err) {
            if (err) {
              console.log("ERROR logging in, redirecting to /signin");
              return res.redirect('/signin')
            }
            return res.redirect(redirectURL || '/dashboard')
          })
        })(req, res, next);
      }
    }
  }

  module.exports = UserSessionController;

}()

)
