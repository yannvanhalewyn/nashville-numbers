(function() {

  "use strict";

  var passport         = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;
  var User             = require('../models/user');
  var config           = require('../config');

  module.exports = function(app) {
    // Passport serialisation
    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(obj, done) {
      User.findById(obj).then(done.bind(null, null)); // This way the found user obj is 2nd param
    });

    app.use(passport.initialize());
    app.use(passport.session());


    // Setup passport strategy
    passport.use(new FacebookStrategy(
      config.facebook, function(accessToken, refreshToken, profile, done) {
        // Verification (aka store the profile or get an existing one)
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        User.findAndUpdateOrCreate({
          provider_id: profile.id
        },{
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          displayName: profile.name.displayName,
          userName: profile.username,
          thumb: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user.png',
          // TODO store the actual image link, this actually publishes the users
          // accesstoken in the markup later!
          picture: "https://graph.facebook.com/" + profile.id +
                   "/picture?width=100&height=100&access_token=" + accessToken,
          provider: 'facebook',
          providerData: JSON.stringify(providerData)
        }).then(function(newUser) {done(null, newUser)}).catch(done);
      }
    ));

  }

}())
