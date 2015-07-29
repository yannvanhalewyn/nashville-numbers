(function() {

  "use strict";

  var _      = require('lodash')
    , db     = require('../config/db')
    , Cypher = require('../helpers/cypher');

  var Hub = function(params) {
    _.merge(this, params);
  };


  /**
   * Destroys the hub.
   *
   */
  Hub.prototype.destroy = function() {
    return db.query(
      "MATCH (hub:Hub) WHERE id(hub) = {hid} " +
      "OPTIONAL MATCH (hub)-[r1]-() " +
      "OPTIONAL MATCH (hub)-[r2]-(hi:HubInvitation)-[r3]-() " +
      "DELETE hub, r1, r2, r3, hi",
      {hid: this._id}
    );
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
   * Creates a CONTAINS relationship between the hub and provided sheet.
   *
   * @param {string/number} sheetID the ID of the sheet.
   * @return {object} An object describing the relationship between the hub and the sheet.
   * @throws {NotFound} When the sheet could not be found (no relationship could
   * be created)
   */
  Hub.prototype.addSheet = function(sheetID) {
    return db.query(
      "MATCH (h:Hub), (sheet:Sheet) WHERE id(h) = {hid} AND id(sheet) = {sid} " +
      "MERGE (h)-[relationship:CONTAINS]->(sheet) RETURN relationship, sheet",
      {hid: this._id, sid: parseInt(sheetID)}
    ).then(function(result) {
      if (_.isEmpty(result)) throw "Could not find sheet with id " + sheetID;
      return result[0];
    });
  }

  /**
   * Destroys a CONTAINS relationship between hub and sheet.
   *
   * @param {string/number} sheetID The ID of the sheet.
   * @throws {NotFound} When the hub doesn't contain the sheet
   */
  Hub.prototype.removeSheet = function(sheetID) {
    return db.query(
      "MATCH (hub:Hub)-[contains:CONTAINS]->(sheet:Sheet) " +
      "WHERE id(hub) = {hid} AND id(sheet) = {sid} " +
      "DELETE contains RETURN hub",
      {hid: this._id, sid: parseInt(sheetID)}
    ).then(function(result) {
      if (_.isEmpty(result)) throw "Hub doesn't contain sheet with id " + sheetID;
    });
  }

  /**
   * Gets all sheets CONTAINED by the hub.
   *
   * @return {array} An array of data representing the sheets
   */
  Hub.prototype.getSheets = function() {
    return db.query(
      "MATCH (hub:Hub)-[:CONTAINS]->(sheet:Sheet) WHERE id(hub) = {hid} " +
      "RETURN sheet ",
      {hid: this._id}
    ).then(function(result) {
      // Result is in the form [{sheet: { ... }, {sheet: { ... } }]. Need to
      // push up every sheet object a nudge. TODO performance?
      return result.map(function(element) {
        return element.sheet;
      });
    });
  }

  /**
   * Finds a specific sheet in the hub.
   *
   * @param {string/number} sheetID The ID of the sheet we're looking for.
   * @return {object} An object representing the searched for sheet data.
   * @throws {NotFound} When no hub-sheet relationship was found.
   */
  Hub.prototype.getSheet = function(sheetID) {
    return db.query(
      "MATCH (hub:Hub)-[:CONTAINS]->(sheet:Sheet) " +
      "WHERE id(hub) = {hid} AND id(sheet) = {sid}" +
      "RETURN sheet",
      {hid: this._id, sid: parseInt(sheetID)}
    ).then(function(result) {
      if (_.isEmpty(result)) throw "Could not find sheet " + sheetID + " in hub " + this._id;
      return result[0].sheet;
    }.bind(this));
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
