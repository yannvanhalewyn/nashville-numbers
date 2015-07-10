(function() {

  "use strict";

  var _ = require('lodash');

  var Cypher = {
    match: function(varname, label, params) {
      var matchString = "";
      if (params) {
        var queries = [];
        _.forEach(params, function(val, key) {
          queries.push(key + ":{" + key + "}");
        });
        matchString = "{" + queries.join(',') + "}";
      }
      return "MATCH (" + varname + ":" + label + matchString + ") ";
    },

    whereIdIs: function(varname, propname) {
      return "WHERE id(" + varname + ") = {" + propname + "} "
    },

    set: function(varname, params) {
      var template = varname + ".{key} = '{val}'";
      var queries = [];
      _.forEach(params, function(val, key) {
        var tmp = template.replace("{key}", key);
        if (_.isNumber(val)) {
          queries.push(tmp.replace("'{val}'", val));
        } else {
          queries.push(tmp.replace("{val}", val));
        }
      });
      return "SET " + queries.join(',') + " ";
    }
  }

  module.exports = Cypher;

}())
