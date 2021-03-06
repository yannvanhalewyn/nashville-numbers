(function() {

  "use strict";

  var include     = require('include');

  // Controllers
  var UserSession        = include('/controllers/user_session_controller')
    , Dashboard          = include('/controllers/dashboard_controller')
    , Friends            = include('/routers/friends')
    , FriendRequests     = include('/routers/friend_requests')
    , Users              = include('/routers/users')
    , Sheets             = include('/routers/sheets')
    , UserHubInvitations = include('/routers/user_hub_invitations')
    , Hubs               = include('/routers/hubs')
    , HubParticipants    = include('/routers/hub_participants')
    , HubInvitations     = include('/routers/hub_invitations')
    , HubSheets          = include('/routers/hub_sheets')
    , Explore            = include('/controllers/explore_controller')

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
    app.route('/explore').get(ensureAuth, Explore.index);

/*
 * =================
 * DEDICATED ROUTERS
 * =================
 */
    app.use('/users', Users);
    app.use('/sheets', Sheets);
    app.use('/users/:user_id/friends', Friends);
    app.use('/users/:user_id/friends/requests', FriendRequests);
    app.use('/users/me/hubinvitations', UserHubInvitations);

    // Hubs
    app.use('/hubs', Hubs);
    app.use('/hubs/:hub_id/participants', HubParticipants);
    app.use('/hubs/:hub_id/invitations', HubInvitations);
    app.use('/hubs/:hub_id/sheets', HubSheets);
  };

  module.exports = routes;

}())
