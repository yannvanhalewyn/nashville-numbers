(function() {

  var include                      = require('include')
    , ensureAuth                   = include('/middlewares/auth')
    , getTargetHub                 = include('/middlewares/hubs/getTargetHub')
    , getTargetHubWithRelationship = include('/middlewares/hubs/getTargetHubWithRelationship')
    , errorStatus                  = include('/middlewares/errors/errorStatus')

  module.exports = {

    middlewares: {
      index:   [],
      show:    [],
      create:  [ensureAuth, getTargetHub, errorStatus(400)],
      destroy: []
    },

    index: function(req, res) {
      res.send("HS INDEX");
    },

    show: function(req, res) {
      res.send("SHOW HUB " + req.params.hub_id + " SHEET " + req.params.sheet_id);
    },

    create: function(req, res) {
      req.target_hub.addSheet(req.body.sheet_id).then(function(relationship) {
        res.json(relationship);
      }, function(error) {
        res.status(400);
        res.send(error);
      });
    },

    destroy: function(req, res) {
      res.send("HS DESTROY" + req.params.hub_id + "-" + req.params.participant_id);
    }
  };

}())
