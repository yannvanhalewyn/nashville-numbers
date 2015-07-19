(function() {

  module.exports = {
    index: function(req, res) {
      res.send("P INDEX");
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
