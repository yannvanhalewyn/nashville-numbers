(function() {

  "use strict";

  var include = require('include')
    , db      = include('/config/db')
    , _       = require('lodash')

  var HubInvitation = function(params) {
    _.merge(this, params);
  }

  /**
   * Sets a permissions property on a HubInvitation node.
   *
   * @param {string/number} value The new permission value.
   * @return {HubInvitation} The updated instance of HubInvitation.
   */
  HubInvitation.prototype.setPermissionValue =  function(value) {
    return db.query(
      "MATCH (hi:HubInvitation) WHERE id(hi) = {iid} SET hi.permissions = {value} RETURN hi",
      {iid: this._id, value: parseInt(value)}
    ).then(function(result) {
      return new HubInvitation(result[0].hi);
    });
  };

  /**
   * Finds a HubInvitation node by it's ID.
   *
   * @param {string/number} id The ID of the invitation we're looking for.
   * @return {object} An instance of HubInvitation representing the HubInvitation node in the db
   * @throws {NotFound} When no instance was found with given ID.
   */
  HubInvitation.findById = function(id) {
    return db.query(
      "MATCH (hi:HubInvitation) WHERE id(hi) = {iid} RETURN hi",
      {iid: parseInt(id)}
    ).then(function(result) {
      if (_.isEmpty(result)) {
        throw "Could not find invitation with id " + id;
      }
      return new HubInvitation(result[0].hi);
    });
  };

  /**
   * Finds a HubInvitation by it's ID sent by a specific user.
   *
   * @param {string/number} invitationID The ID of the invitation we're looking for.
   * @param {string/number} senderID The ID of the user that sent the invitation.
   * @return {HubInvitation} An instance of HubInvitation representing the invitation in the db.
   * @throws {NotFound} When either the invitation doesn't exist or wasn't sent
   * by passed in user.
   */
  HubInvitation.findByIdAndSentBy = function(invitationID, senderID) {
    return db.query(
      "MATCH (sender:Person)-[:SENT]->(hi:HubInvitation) " +
      "WHERE id(hi) = {iid} AND id(sender) = {sid} RETURN hi",
      {iid: parseInt(invitationID), sid: parseInt(senderID)}
    ).then(function(result) {
      if (_.isEmpty(result)) {
        throw "Could not find invitation " + invitationID + " sent by user " + senderID;
      }
      return new HubInvitation(result[0].hi);
    });
  };

  /**
   * Finds a HubInvitation by it's ID sent to a specific user.
   *
   * @param {string/number} invitationID The ID of the invitation we're looking for.
   * @param {string/number} receiverID The ID of the user that received the invitation.
   * @return {HubInvitation} An instance of HubInvitation representing the invitation in the db.
   * @throws {NotFound} When either the invitation doesn't exist or wasn't sent
   * to passed in user.
   */
  HubInvitation.findByIdAndSentTo = function(invitationID, receiverID) {
    return db.query(
      "MATCH (receiver:Person)<-[:TO]-(hi:HubInvitation) " +
      "WHERE id(hi) = {iid} AND id(receiver) = {rid} RETURN hi",
      {iid: parseInt(invitationID), rid: parseInt(receiverID)}
    ).then(function(result) {
      if (_.isEmpty(result)) {
        throw "Could not find invitation " + invitationID + " sent to user " + receiverID;
      }
      return new HubInvitation(result[0].hi);
    });
  }

  module.exports = HubInvitation;

}())
