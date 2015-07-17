(function() {

  module.exports = {
    index: function(req, res) {
      return res.send("INDEX");
      res.render('hubs', {active_hubs: true})
    },

    show: function(req, res) {
      res.send("SHOW " + req.params.hub_id);
    },

    create: function(req, res) {
      res.send("CREATE ");
    },

    update: function(req, res) {
      res.send("UPDATE " + req.params.hub_id);
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.hub_id);
    }
  };

}())
