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


/*
 * ======
 * STATIC
 * ======
 */
  User.create = function(params) {
    return db.query(
      "CREATE (p:Person {" +
        "firstName: {firstName}," +
        "lastName: {lastName}, provider_id: {provider_id}," +
        "provider: {provider}" +
      "}) RETURN p", params)
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
