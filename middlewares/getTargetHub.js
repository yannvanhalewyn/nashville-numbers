(function() {

  "use strict";

  var Hub = require('../models/hub');

  var getTargetHub = function(req, res, next) {
    return Hub.findById(req.params.hub_id).then(function(hub) {
      req.target_hub = hub;
      next();
    }, function(err) {
      res.redirect('/hubs');
    });
  };

  module.exports = getTargetHub;

}())

