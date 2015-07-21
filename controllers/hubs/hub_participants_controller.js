(function() {

  var include = require('include')
    , getTargetHub = include('/middlewares/getTargetHub')

  module.exports = {

    middlewares: {
      index:   [getTargetHub],
      show:    [],
      create:  [],
      update:  [],
      destroy: []
    },

    index: function(req, res) {
      req.target_hub.getParticipants().then(function(participants) {
        res.json(participants);
      });
    },

    create: function(req, res) {
      res.send("P CREATE " + req.body);
    },

    update: function(req, res) {
      res.send("P UPDATE " + req.params.hub_id + "-" + req.params.participant_id);
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.hub_id + "-" + req.params.participant_id);
    }
  };

}())
