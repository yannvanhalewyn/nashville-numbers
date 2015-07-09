(function() {

  "use strict";

  var Q     = require('q')
    , neo4j = require('neo4j')
    , config = require('../config')
    , db    = new neo4j.GraphDatabase(config.db_url);

  db.query = function(cypher, params) {
    var defered = Q.defer();
    this.cypher({query: cypher, params: params}, function(err, res) {
      if (err) {
        defered.reject(err);
      } else {
        defered.resolve(res);
      }
    })
    return defered.promise;
  }

  module.exports = db;

}())
