(function() {

  "use strict";

  var _      = require('lodash')
    , db     = require('../config/db')
    , Cypher = require('../helpers/cypher');

  var Hub = function(params) {
    _.merge(this, params);
  };


  /**
   * Returns all the participants that have a relationship to the hub.
   *
   * @return {array} The list of participants in the hub (including the
   * creator). The array consists of multiple objects that each have properties
   * user         -> representing the user that participates
   * relationship -> representing the relationship between said user and the hub.
   */
  Hub.prototype.getParticipants = function() {
    return db.query(
      "MATCH (user:Person)-[relationship]->(hub:Hub) " +
      "WHERE id(hub) = {hid} RETURN user, relationship", {hid: this._id}
    );
  }

  /**
   * Gets all open invitations for the hub.
   *
   * @return {array} The array of objects representing invitations.
   */
  Hub.prototype.getInvitations = function() {
    return db.query(
      "MATCH (invitee:Person)<-[:TO]-(invitation:HubInvitation)-[:TO_JOIN]->(h:Hub) " +
      "WHERE id(h) = {hid} RETURN invitation, invitee",
      {hid: this._id}
    );
  }

  /**
   * Removes a participant from the hub.
   *
   * @param {string/number} userID The userID of the participant.
   */
  Hub.prototype.removeParticipant = function(userID) {
    return db.query(
      "MATCH (p:Person)-[joined:JOINED]->(hub:Hub) " +
      "WHERE id(hub) = {hid} AND id(p) = {pid} " +
      "DELETE joined",
      {hid: this._id, pid: parseInt(userID)}
    );
  }

  /**
   * Creates a new hub
   *
   * @param {object} params The params to create the hub. It needs a 'creator_id' property to create the CREATED relationship to the hub.
   * @return {object} An instance of Hub representing the created hub.
   */
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

  /**
   * Finds a hub by ID.
   *
   * @param {number} hubID The ID of the hub we're looking for.
   * @return {object} An instance of Hub representing the found Hub. ! Throws a
   * NotFound exception when not found.
   */
  Hub.findById = function(hubID) {
    return db.query(
      Cypher.match('h', 'Hub') + Cypher.whereIdIs('h', 'hid') + "RETURN h",
      {hid: parseInt(hubID)}
    ).then(function(result) {
      if (_.isEmpty(result)) {
        throw "Could not find hub with id " + hubID;
      }
      return new Hub(result[0].h);
    });
  }

  module.exports = Hub;

}())
