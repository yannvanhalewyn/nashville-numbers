(function() {

  var include                      = require('include')
    , ensureAuth                   = include('/middlewares/auth')
    , getTargetHub                 = include('/middlewares/getTargetHub')
    , getTargetHubWithRelationship = include('/middlewares/getTargetHubWithRelationship');

  module.exports = {

    middlewares: {
      index:   [ensureAuth, getTargetHub],
      show:    [],
      update:  [],
      destroy: [ensureAuth, getTargetHubWithRelationship]
    },

    index: function(req, res) {
      req.target_hub.getParticipants().then(function(participants) {
        res.json(participants);
      });
    },

    update: function(req, res) {
      res.send("P UPDATE " + req.params.hub_id + "-" + req.params.participant_id);
    },

    destroy: function(req, res) {
      req.target_hub.removeParticipant(req.params.participant_id).then(function(foo) {
        res.json({destroyed: true});
      }, function(error) {
        res.status(400);
        res.send(error);
      });
    }
  };

}())
