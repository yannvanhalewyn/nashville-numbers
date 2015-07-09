(function() {

  // var moment = require('moment');
  var db = require('../config/db')
    , _ = require('lodash')

  var DEFAULT = {
    title: "title",
    artist: "artist",
    visibility: "public"
  };

  var Sheet = function(params) {
    _.merge(this, params);
  }

/*
 * ========
 * INSTANCE
 * ========
 */
  Sheet.prototype.update = function(params) {
    var setTemplate = "s.{key} = '{val}'"
    var queries = [];
    _.forEach(params, function(val, key) {
      var tmp = setTemplate.replace("{key}", key);
      queries.push(tmp.replace("{val}", val));
    });
    var setString = "SET " + queries.join(',');
    return db.query(
      "MATCH (s:Sheet) WHERE id(s) = {sid} " + setString + " RETURN s", {sid: this._id}
    );
  }

  Sheet.prototype.destroy = function() {
    return db.query(
      "MATCH (s:Sheet) WHERE id(s) = {sid} " +
      "OPTIONAL MATCH s-[r]-() DELETE s,r", {sid: this._id}
    );
  }

/*
 * ======
 * STATIC
 * ======
 */
  // Should I check if the UID is an existing user?
  // ACTUALLY it doesn't go through with the query if MATCH finds nothing.
  // GOD I LOVE neo4j!! It does my error handling (missing uid), invalid uid,
  Sheet.create = function(params) {
    params = _.assign({}, DEFAULT, params);
    return db.query(
      "MATCH (p:Person) WHERE id(p) = {uid} " +
      "CREATE (s:Sheet {" +
        "title: {title}," +
        "artist: {artist}," +
        "visibility: {visibility}" +
      "})," +
      "(p)-[:AUTHORED]->(s)" +
      "RETURN s", params)
    .then(function(res) {
      return new Sheet(res[0].s);
    });
  }

  module.exports = Sheet;

}())
