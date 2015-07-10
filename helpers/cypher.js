(function() {

  "use strict";

  var _ = require('lodash');

  function _paramsToMatchString(params) {
    if (!params) return "";
    var queries = [];
    _.forEach(params, function(val, key) {
      queries.push(key + ":{" + key + "}");
    });
    return "{" + queries.join(',') + "}";
  }

  function _paramsToSetString(varname, params) {
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
    return queries.join(',');
  }

  var Cypher = {
    match: function(varname, label, params) {
      return "MATCH (" + varname + ":" + label + _paramsToMatchString(params) + ") ";
    },

    whereIdIs: function(varname, propname) {
      return "WHERE id(" + varname + ") = {" + propname + "} "
    },

    set: function(varname, params) {
      if (!params || _.isEmpty(params)) return "";
      return "SET " + _paramsToSetString(varname, params) + " ";
    },

    merge: function(varname, label, params) {
      if (!params || _.isEmpty(params)) throw "Should not MERGE without params!";
      return "MERGE (" + varname + ":" + label + _paramsToMatchString(params) + ") ";
    }
  }

  module.exports = Cypher;

}())
