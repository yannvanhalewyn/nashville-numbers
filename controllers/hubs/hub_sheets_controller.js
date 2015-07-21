(function() {

  module.exports = {

    middlewares: {
      index:   [],
      show:    [],
      create:  [],
      destroy: []
    },

    index: function(req, res) {
      res.send("HS INDEX");
    },

    show: function(req, res) {
      res.send("SHOW HUB " + req.params.hub_id + " SHEET " + req.params.sheet_id);
    },

    create: function(req, res) {
      res.send("HS CREATE " + req.body);
    },

    destroy: function(req, res) {
      res.send("HS DESTROY" + req.params.hub_id + "-" + req.params.participant_id);
    }
  };

}())
