(function() {

  "use strict";

  /**
   * Caches
   * - the hub with hub_id params as req.target_hub
   * - the relationship of the logged in user to that hub as
   *   req.relationshipToTargetHub
   *
   * sends a 400 when user.getTargetHubWithRelationship throws an error. This
   * happens when the user has no relationship to that hub.
   *
   */
  var getTargetHubWithRelationship = function(req, res, next) {
    req.user.getRelationshipToHub(req.params.hub_id).then(function(result) {
      req.target_hub = result.hub;
      req.target_hub_relationship_to_user = result.relationship;
      next();
    }, function(err) {
      res.status(400);
      res.send(err);
    });
  }

  module.exports = getTargetHubWithRelationship;

}())
