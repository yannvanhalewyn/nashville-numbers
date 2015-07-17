(function() {

  "use strict";

  var _      = require('lodash')
    , db     = require('../config/db')
    , Cypher = require('../helpers/cypher');

  var Hub = function(params) {
    _.merge(this, params);
  };

  Hub.create = function(params) {
    var createParams = _.omit(params, 'creator_id');
    var createParamsString = _.map(createParams, function(val, key) {
      return key + ": {" + key + "}";
    }).join(', ');
    createParamsString = "{ " + createParamsString + " }"

    return db.query(
      Cypher.match('u', 'Person') +
      Cypher.whereIdIs('u', 'creator_id') +
      "CREATE (u)-[:CREATED]->(h:Hub " + createParamsString + ") " +
      "return h", params
    ).then(function(result) {
      return new Hub(result[0].h);
    });
  };

  module.exports = Hub;

}())
