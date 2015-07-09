(function() {

  "use strict";

  var include     = require('include');

  // Controllers
  var UserSession = include('/controllers/user_session_controller')
    , Dashboard   = include('/controllers/dashboard_controller')
    , Sheets      = include('/controllers/sheet_controller')
    , Friends     = include('/routes/friends')
    , Users       = include('/routes/users')
    , Hubs        = include('/controllers/hub_controller')
    , Explore     = include('/controllers/explore_controller')

  // Middlewares
  var ensureAuth = include('/middlewares/auth');

  var routes = function(app) {

/*
 * ============
 * STATIC PAGES
 * ============
 */
    app.route('/home').get(function(req, res) {
      res.render('home', {layout: null});
    });

/*
 * =============
 * USER SESSIONS
 * =============
 */
    // Good route name would be /users/me to usercontroller.me for the
    // usersettings
    app.route('/logout').get(UserSession.logout);
    app.route('/auth/facebook').get(UserSession.newFacebookSession);
    app.route('/auth/facebook/callback').get(UserSession.oauthCallback('facebook'));

/*
 * =========
 * APP PAGES
 * =========
 */
    app.route('/').get(ensureAuth, Dashboard.index);
    app.route('/dashboard').get(ensureAuth, Dashboard.index);
    app.route('/hubs').get(ensureAuth, Hubs.index);
    app.route('/explore').get(ensureAuth, Explore.index);

/*
 * =============
 * USERS/FRIENDS
 * =============
 */
    app.use('/users/:user_id/friends', Friends);
    app.use('/users', Users);
/*
 * =========
 * RESOURCES
 * =========
 */
    app.route('/sheets').get(ensureAuth, Sheets.index)
                        .post(Sheets.create);
    app.route('/sheets/:id').get(ensureAuth, Sheets.show)
                            .put(ensureAuth, Sheets.update)
                            .delete(ensureAuth, Sheets.destroy)
  };

  module.exports = routes;

}())
