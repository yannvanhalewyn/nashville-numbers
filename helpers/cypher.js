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

    /**
     * match
     *
     * @param {string} varname The name of the query variable we're matching against.
     * @param {string} label the name of the label we're matching against. e.g.: "Person".
     * @param {object} params The params we're matching against. Will genereate {propName: {propName}, etc..}
     * @return {string} The query string. e.g.: "MATCH (varname:label {propName: {propName}, ..}) "
     */
    match: function(varname, label, params) {
      return "MATCH (" + varname + ":" + label + _paramsToMatchString(params) + ") ";
    },

    /**
     * whereIdIs
     *
     * @param {String} varname The name of the query variable we're matching against.
     * @param {String} propname The name of the ID property in a later specified params object.
     * @return {string} The query string. e.g.: "WHERE id(varname) = {propname} ".
     */
    whereIdIs: function(varname, propname) {
      return "WHERE id(" + varname + ") = {" + propname + "} "
    },

    /**
     * set
     *
     * @param {string} varname The name of the query variable we're matching against.
     * @param {object} params The params we're setting.
     * @return {string} The query set-string. e.g.: "SET varname.propName = {propName}, .."
     */
    set: function(varname, params) {
      if (!params || _.isEmpty(params)) return "";
      return "SET " + _paramsToSetString(varname, params) + " ";
    },

    /**
     * merge
     *
     * @param {string} varname The name of the query variable we're merging.
     * @param {string} label The name of the label (type) we're merging. e.g.: "Person".
     * @param {object} params The params based on which the object will be created or merged.
     * @return {string} The query merge-string. e.g.: "MERGE (varname:label {propName: {propName}, .. })"
     */
    merge: function(varname, label, params) {
      if (!params || _.isEmpty(params)) throw "Should not MERGE without params!";
      return "MERGE (" + varname + ":" + label + _paramsToMatchString(params) + ") ";
    },

    /**
     * create
     *
     * @param {string} varname The name of the query variable we're creating.
     * @param {string} label The name of the label (type) we;re merging. e.g.: "Person".
     * @param {object} params The params with which the new entity will be created.
     * @return {string} The create-string. e.g.: "CREATE (varname:label {propName: {propName}, .. })"
     */
    create: function(varname, label, params) {
      return "CREATE (" + varname + ":" + label + _paramsToMatchString(params) + ") ";
    }
  }

  module.exports = Cypher;

}())
