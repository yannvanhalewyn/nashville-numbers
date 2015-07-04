(function() {

  "use strict";

  var _port = 3000;
  var _base_url = 'http://localhost';
  var _root_path = _base_url + ':' + _port;

  var config = {
    PORT: _port,
    ROOT_PATH: _root_path,
    db_url: 'mongodb://localhost/nashville_numbers',
    facebook: {
      clientID: "854040621311184",
      clientSecret: "931475fc8ca3b75f7472d3ed544f69d3",
      callbackURL: _root_path + '/auth/facebook/callback',
      profileFields: ['id', 'name', 'displayName', 'photos', 'hometown', 'friends'],
      enableProof: false
    }
  };

  module.exports = config;

}())
