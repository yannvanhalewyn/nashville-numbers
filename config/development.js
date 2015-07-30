(function() {

  "use strict";

  console.log("Using development config.");

  var _port = 3000;
  var _base_url = 'http://localhost';
  var _root_path = _base_url + ':' + _port;

  var config = {
    PORT: _port,
    ROOT_PATH: _root_path,
    db_url: 'http://neo4j:Diabolo1n@localhost:7474',
    facebook: {
      clientID: "865909986790914",
      clientSecret: "3233c5b956a5fccbecdc1f1e7a9652d8",
      callbackURL: _root_path + '/auth/facebook/callback',
      profileFields: ['id', 'name', 'displayName', 'photos', 'hometown', 'friends'],
      enableProof: false
    }
  };

  module.exports = config;

}())
