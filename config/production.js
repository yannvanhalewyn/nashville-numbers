(function() {

  "use strict";

  console.log("Using production config.");

  var _base_url = 'http://sheetbucket.herokuapp.com';

  var config = {
    db_url: process.env['GRAPHENEDB_URL'],
    facebook: {
      clientID: "854040621311184",
      clientSecret: "931475fc8ca3b75f7472d3ed544f69d3",
      callbackURL: _base_url + '/auth/facebook/callback',
      profileFields: ['id', 'name', 'displayName', 'photos', 'hometown', 'friends'],
      enableProof: false
    }
  };

  module.exports = config;

}())
