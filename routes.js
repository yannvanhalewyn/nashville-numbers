(function() {

  var UserSession = require('./controllers/user_session_controller');
  var DashBoard = require('./controllers/dashboard_controller');
  var Sheets = require('./controllers/sheet_controller');
  var Hubs = require('./controllers/hub_controller');
  var Explore = require('./controllers/explore_controller');

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
    app.route('/dashboard').get(DashBoard.index);
    app.route('/hubs').get(Hubs.index);
    app.route('/explore').get(Explore.index);

/*
 * =========
 * RESOURCES
 * =========
 */
    app.route('/sheets').get(Sheets.index)
                        .post(Sheets.create);
    app.route('/sheets/:id').get(Sheets.show);
  };

  module.exports = routes;

}())
