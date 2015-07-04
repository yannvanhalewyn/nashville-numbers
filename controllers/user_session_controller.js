(function() {

  var config = require('../config');
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;
  var User = require('../models/user');

  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.name.displayName,
        userName: profile.username,
        provider: 'facebook',
        provider_id: profile.id,
        providerData: providerData
      }
      User.findOrCreate(providerUserProfile, function(err, user) {
        done(err, user);
      });
    }
  ));

  module.exports.controller = function(app) {

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
            passport.authenticate('facebook',
                                  { failureRedirect: '/' }),
            function(req, res) {
              // Success
              console.log("success");
              res.redirect('/dashboard');
            }
    );

  };

}()

)
