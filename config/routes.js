(function() {

  "use strict";

  var UserSession = require('../controllers/user_session_controller');
  var Dashboard = require('../controllers/dashboard_controller');
  var Sheets = require('../controllers/sheet_controller');
  var Hubs = require('../controllers/hub_controller');
  var Explore = require('../controllers/explore_controller');

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
 * =========
 * RESOURCES
 * =========
 */
    app.route('/sheets').get(ensureAuth, Sheets.index)
                        .post(Sheets.create);
    app.route('/sheets/:id').get(ensureAuth, Sheets.show);
  };

  module.exports = routes;

  // Route middleware to ensure authentication
  function ensureAuth(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/home');
    }
    return next();
  }

}())
