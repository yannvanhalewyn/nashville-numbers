(function() {

  "use strict";


  /**
   * Ensures the logged in user was the creator of the hub. It does this by
   * checking req.target_hub_relationship_to_user.type === "CREATED"
   * If not, it calls enxt with the error "You are not the creator of this hub."
   *
   * @param {} req
   * @param {} res
   * @param {} next
   */
  var ensureAuthored = function(req, res, next) {
    if (req.target_hub_relationship_to_user.type === "CREATED") {
      return next();
    }
    next("You are not the creator of this hub.");
  }

  module.exports = ensureAuthored;

}())
