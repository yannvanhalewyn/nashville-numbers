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
  /**
   * Creates a sheet with a AUTHORED_BY relationship to the user.
   *
   * @param {object} params The params for the new sheet.
   * @return {Sheet} An instance of Sheet containing the properties of the newly created sheet.
   */
  User.prototype.createSheet = function(params) {
    var defaults = {title: "title", artist: "artist", visibility: "public"};
    params = _.assign({}, defaults, {uid: this._id}, params);
    return Sheet.create(params);
  };

  /**
   * Returns an array of sheets that have a AUTHORED (by) relationship to the user.
   *
   * @return {Sheet} An instance of Sheet containing the params of the newly created
   * persisted sheet.
   */
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

  User.prototype.sendFriendRequest = function(friendID) {
    return db.query(
      "MATCH (u:Person), (f:Person) WHERE id(u) = {uid} AND id(f) = {fid}" +
      "CREATE UNIQUE (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN r",
      {uid: this._id, fid: parseInt(friendID)}
    ).then(function(result) {
      return result[0].r;
    })
  }

  User.prototype.acceptFriendRequest = function(requestID) {
    return db.query(
      "MATCH (f:Person)-[rs:SENT]->(r:FriendRequest)-[rt:TO]->(u:Person) " +
      "WHERE id(r) = {rid} " +
      "DELETE rs,rt,r " +
      "CREATE (u)-[:FRIEND]->(f)",
      {rid: requestID}
    );
  }

  User.prototype.deleteFriend = function(friendID) {
    return db.query(
      "MATCH (u:Person)-[r:FRIEND]-(f:Person) " +
      "WHERE id(u) = {uid} AND id(f) = {fid} " +
      "DELETE r ",
      {uid: this._id, fid: parseInt(friendID)}
    );
  }


/*
 * ======
 * STATIC
 * ======
 */
  /**
   * Creates a new user.
   *
   * @param {object} params The params for the new user.
   * @return {User} An instance of User containing the params of the newly created user.
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

  /**
   * Finds a user by it's ID.
   *
   * @param {number/string} id The ID of the user we're looking for.
   * @return {User} An instance of User containing the params of the found user.
   */
  User.findById = function(id) {
    return db.query("MATCH (p:Person) WHERE id(p) = {id} RETURN p", {id: id})
    .then(function(result) {
      return new User(result[0].p);
    });
  }

  /**
   * Creates or updates a user entitity in the database (for login)
   *
   * @param {object} mergeParams The params for which we're trying to find a user.
   * @param {object} params The variants: The params that will be updated but do not define the user we're looking for.
   * @return {User} An instance of User containing the params of the newly created user.
   */
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
