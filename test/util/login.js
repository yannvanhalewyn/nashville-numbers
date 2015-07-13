(function() {

  "use strict";

  // Modifies the res object to pass passport authentication
  var login = function(user, req) {
    req.isAuthenticated = function() {
      return true;
    }
    req.user = user;
  }

  module.exports = login;

}())
