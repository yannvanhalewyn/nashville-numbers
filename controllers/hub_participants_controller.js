(function() {

  module.exports = {
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
