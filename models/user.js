(function() {

  "use strict";

  var include = require('include')
    , db     = require('../config/db')
    , _      = require('lodash')
    , Cypher = include('/helpers/cypher')
    , Sheet = include('/models/sheet') // For sheet instantiation

/*
 * ===========
 * CONSTRUCTOR
 * ===========
 */
  var User = function(params) {
    _.merge(this, params);
  };

/*
 * ========
 * INSTANCE
 * ========
 */
  User.prototype.createSheet = function(params) {
    var defaults = {title: "title", artist: "artist", visibility: "public"};
    params = _.assign({}, defaults, {uid: this._id}, params);
    return db.query(
      "MATCH (p:Person) WHERE id(p) = {uid}" +
      "CREATE (s:Sheet {" +
        "title: {title}," +
        "artist: {artist}," +
        "visibility: {visibility}" +
      "})," +
      "(p)-[r:AUTHORED]->(s)" +
      "RETURN s", params
    ).then(function(res) {
      return new Sheet(res[0].s);
    });
  };

  User.prototype.sheets = function() {
    return db.query(
      "MATCH (p:Person)-[:AUTHORED]->(s:Sheet) WHERE id(p) = {uid} RETURN s",
      {uid: this._id}
    ).then(function(res) {
      // Every entry is stored in 's'. Just move them up a nudge.
      return res.map(function(entry) {
        return entry.s;
      });
    })
  }


/*
 * ======
 * STATIC
 * ======
 */
  User.create = function(params) {
    var setTemplate = "{key}: '{val}'"
    var queries = [];
    _.forEach(params, function(val, key) {
      if (val) {
        if (key == "providerData") val = JSON.stringify(val);
        var tmp = setTemplate.replace("{key}", key);
        queries.push(tmp.replace("{val}", val));
      }
    });
    var paramsString = queries.join(',');
    return db.query(
      "CREATE (p:Person {" + paramsString + "}) RETURN p", params)
    .then(function(res) {
      return new User(res[0].p);
    });
  }

  User.findById = function(id) {
    return db.query("MATCH (p:Person) WHERE id(p) = {id} RETURN p", {id: id})
    .then(function(result) {
      return new User(result[0].p);
    });
  }

  User.findAndUpdateOrCreate = function(mergeParams, params) {
    var query = Cypher.merge('p', 'Person', mergeParams);
    query += Cypher.set('p', params);
    query += "RETURN p";
    return db.query(query, _.assign(mergeParams, params)).then(function(res) {
      return new User(res[0].p);
    });
  }

  module.exports = User;

}())
