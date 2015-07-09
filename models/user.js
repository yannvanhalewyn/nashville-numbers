(function() {

  "use strict";

  var db = require('../config/db')
    , _ = require('lodash')

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
    params.uid = this._id;
    return db.query(
      "MATCH (p:Person) WHERE id(p) = {uid}" +
      "CREATE (s:Sheet {" +
        "title: {title}," +
        "artist: {artist}," +
        "visibility: {visibility}" +
      "})," +
      "(p)-[r:AUTHORED]->(s)" +
      "RETURN p,s,r", params
    );
  };

  User.prototype.sheets = function() {
    return db.query(
      "MATCH (p:Person)-[:AUTHORED]->(s:Sheet) WHERE id(p) = {uid} RETURN s",
      {uid: this._id}
    );
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
      return result[0].p;
    });
  }

  module.exports = User;

}())
