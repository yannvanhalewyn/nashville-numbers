(function() {

  "use strict";

  var include = require('include')
    , db      = require('../config/db')
    , _       = require('lodash')
    , Cypher  = include('/helpers/cypher')
    , Sheet   = include('/models/sheet') // For sheet instantiation
    , Hub     = include('/models/hub')

/*
 * ===========
 * CONSTRUCTOR
 * ===========
 */
  var User = function(params) {
    _.merge(this, params);
  };

/*
 * ===============
 * INSTANCE:SHEETS
 * ===============
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

/*
 * ====================
 * INSTANCE:FRIENDSHIPS
 * ====================
 */
  /**
   * Sends a friendrequest to the user with given id.
   * This doesn't create a FriendRequest if:
   * - userA is already friends with userB
   * - There already is a request from userA to userB
   * - There already is a request from userB to userA
   *
   * @param {string/number} friendID The ID of the friend to whom we want to send the request.
   * @return {object} The FriendRequest node that was created (empty if none)
   */
  User.prototype.sendFriendRequest = function(friendID) {
    return db.query(
      "MATCH (u:Person), (f:Person) " +
      "WHERE NOT (u)-[:FRIEND]-(f) AND NOT (u)--(:FriendRequest)--(f) AND id(u) = {uid} AND id(f) = {fid}" +
      "MERGE (u)-[:SENT]->(r:FriendRequest)-[:TO]->(f) RETURN r",
      {uid: this._id, fid: parseInt(friendID)}
    ).then(function(result) {
      if (_.isEmpty(result)) {
        return {};
      }
      return result[0].r;
    })
  }

  /**
   * Accepts a friendRequest with the given ID.
   *
   * @param {string/number} requestID The ID of the request node.
   * @return {object} the created relationship. An empty object if none created.
   */
  User.prototype.acceptFriendRequest = function(requestID) {
    return db.query(
      "MATCH (f:Person)-[rs:SENT]->(r:FriendRequest)-[rt:TO]->(u:Person) " +
      "WHERE id(u) = {uid} AND id(r) = {rid} " +
      "DELETE rs,rt,r " +
      "CREATE (u)-[created:FRIEND]->(f) RETURN created",
      {uid: this._id, rid: parseInt(requestID)}
    ).then(function(result) {
      if (_.isEmpty(result)) {
        return {};
      }
      return result[0].created;
    });
  }

  /**
   * Destroys a friendRequest with the given ID.
   *
   * @param {string/number} requestID The ID of the request node.
   */
  User.prototype.destroyFriendRequest = function(requestID) {
    return db.query(
      "MATCH (f:Person)-[rs]-(r:FriendRequest)-[rt]-(u:Person) " +
      "WHERE id(u) = {uid} AND id(r) = {rid} " +
      "DELETE rs,rt,r ", {uid: this._id, rid: parseInt(requestID)}
    )
  }

  /**
   * Deletes a FRIEND relationship to user with given friendID.
   *
   * @param {string/number} friendID The ID of the FRIEND to whom we wish to delete
   * the relationship.
   */
  User.prototype.deleteFriend = function(friendID) {
    return db.query(
      "MATCH (u:Person)-[r:FRIEND]-(f:Person) " +
      "WHERE id(u) = {uid} AND id(f) = {fid} " +
      "DELETE r ",
      {uid: this._id, fid: parseInt(friendID)}
    );
  }

  /**
   * Returns a list of all open incoming friend requests.
   *
   * @return {array} An array of FriendRequest objects containing request as the
   * request node, sender as the user initiating the request.
   */
  User.prototype.getOpenFriendRequests = function() {
    return db.query(
      "MATCH (sender:Person)-[:SENT]->(request:FriendRequest)-[:TO]->(u:Person) " +
      "WHERE id(u) = {uid} RETURN request,sender", {uid: this._id}
    );
  }

  /**
   * Gets the current friendship status between the user and another user.
   *
   * @param {string/number} friendID The ID of the other user we're querrying the friendship with.
   * @return {object} The object describing the friend relationship. It has
   * three properties: the friendship relationship, the sentRequest and the
   * receivedRequest. Each or all of those are null when inexistant.
   */
  User.prototype.getFriendship = function(friendID) {
    return db.query(
      "MATCH (u:Person), (f:Person) " +
      "OPTIONAL MATCH (u)-[friendship:FRIEND]-(f) " +
      "OPTIONAL MATCH (u)-[:SENT]->(sentRequest:FriendRequest)-[:TO]->(f) " +
      "OPTIONAL MATCH (f)-[:SENT]->(receivedRequest:FriendRequest)-[:TO]->(u) " +
      "WITH u,f,friendship,sentRequest,receivedRequest " +
      "WHERE id(u) = {uid} AND id(f) = {fid} " +
      "RETURN friendship,sentRequest,receivedRequest",
      {uid: this._id, fid: parseInt(friendID)}
    ).then(function(result) {
      return result[0];
    });
  }

  /**
   * Finds a user's friends by fullname given a collection of words that each get matched
   *
   * @param {string} query A string with words to be matched
   * @return {array} The array of users that have a matching full name
   */
  User.prototype.findFriends = function(query) {
    var whereClauses = _wordsToMultipleCypherRegexes(query, 'fullname');
    return db.query(
      "MATCH (u:Person)-[:FRIEND]-(f:Person) " +
      "WITH u, f, f.firstName + ' ' + f.lastName AS fullname " +
      "WHERE id(u) = {uid} AND " + whereClauses + " RETURN f",
      {uid: this._id, regex: "(?i).*" + query + ".*"}
    ).then(function(result) {
      return result.map(function(r) {
        return r.f;
      });
    });
  }

/*
 * =============
 * INSTANCE:HUBS
 * =============
 */
  /**
   * Creates a Hub owned by user
   *
   * @param {string} title The title of the new hub.
   * @return {object} An instance of Hub model representing the created hub.
   */
  User.prototype.createHub = function(name) {
    return Hub.create({creator_id: this._id, name: name});
  }

  /**
   * Gets all hubs related to user.
   *
   * @return {array} The array with all the hubs. Each element in the array is
   * an object containing the hub and the relationship.
   */
  User.prototype.getHubs = function() {
    return db.query(
      "MATCH (u:Person)-[relation]->(hub:Hub) " +
      "WHERE id(u) = {uid} RETURN relation, hub", {uid: this._id}
    )
  }

  /**
   * Creates a HubInvitation linked to the user as sender, target user as
   * receiver and hub as mean.
   *
   * @param {string/number} hubID The ID of the hub to which we want to invite
   * the user.
   * @param {string/number} otherUserID The ID of the user we whish to invite to
   * the hub.
   * @return {object} the object containing the HubInvitation object as
   * 'invitation' proeprty and the invited person object as 'invitee' property.
   * Will send an empty object when no invitation has been created.
   */
  User.prototype.inviteToHub = function(hubID, otherUserID) {
    return db.query(
      "MATCH (u:Person)-[:CREATED]->(h:Hub), (invitee:Person) " +
      "OPTIONAL MATCH (u)-[:SENT]-(existinghi:HubInvitation)-[:TO]->(invitee:Person), (existinghi)-[:TO_JOIN]->(h) " +
      "WITH u, invitee, h, existinghi " +
      "WHERE id(u) = {uid} AND id(invitee) = {iid} AND id(h) = {hid} AND NOT u = invitee " +
      "AND existinghi IS NULL " +
      "CREATE (u)-[:SENT]->(invitation:HubInvitation)-[:TO]->(invitee), " +
      "(invitation)-[:TO_JOIN]->(h) " +
      "RETURN invitation, invitee", 
      {uid: this._id, iid: parseInt(otherUserID), hid: parseInt(hubID)}
    ).then(function(result) {
      return result[0];
    });
  }

  /*
   * Accept hub request:
   * MATCH (sender:Person)-[sent:SENT]->(hi:HubInvitation)-[to:TO]->(receiver:Person), (hi)-[toJoin:TO_JOIN]-(hub:Hub)
   * WHERE id(hi) = 679
   * CREATE (receiver)-[joined:JOINED]->(hub)
   * DELETE sent, to, toJoin, hi
   * RETURN receiver, hub
   */


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
  };

  /**
   * Finds a user by it's fullname given a collection of words that each get matched
   *
   * @param {string} query A string with words to be matched
   * @return {array} The array of users that have a matching full name
   */
  User.findByName = function(query) {
    var whereClauses = _wordsToMultipleCypherRegexes(query, 'fullname');
    return db.query(
      "MATCH (p:Person) " +
      "WITH p, p.firstName + ' ' + p.lastName AS fullname " +
      "WHERE " + whereClauses + " RETURN p"
    ).then(function(result) {
      return result.map(function(entry) {
        return entry.p
      });
    });
  };

  /**
   * Finds a user by it's ID.
   *
   * @param {number/string} id The ID of the user we're looking for.
   * @return {User} An instance of User containing the params of the found user.
   */
  User.findById = function(id) {
    return db.query("MATCH (p:Person) WHERE id(p) = {id} RETURN p", {id: parseInt(id)})
    .then(function(result) {
      if (_.isEmpty(result)) {
        throw "Could not find user with id " + id;
      }
      return new User(result[0].p);
    });
  }

  /**
   * Creates or updates a user entitity in the database (for login)
   *
   * @param {object} mergeParams The params for which we're trying to find a user.
   * @param {object} params The variants: The params that will be updated but do
   * not define the user we're looking for.
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

  /**
   * Splits the given string of words and returns a match string matching the
   * given matcher to a case-insensitive regex of every word.
   *
   * Example: _wordsToMultipheCypherRegexes("James May", 'fullname')
   *   -> "fullname =~ '(?i).*James.*' AND fullname =~ '(?i).*May.*'"
   *
   * @param {string} string The query string - eg: "James May"
   * @param {string} matcher the matcher. eg: 'fullname'
   * @return {string} The match query.
   */
  function _wordsToMultipleCypherRegexes(string, matcher) {
    return string.split(" ").filter(function(word) {
      if (word.length > 0) return true;
    }).map(function(word) {
      return matcher + ' =~ "(?i).*' + word + '.*"';
    }).join(" AND ");
  }

}())
