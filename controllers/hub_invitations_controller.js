(function() {

  module.exports = {
    index: function(req, res) {
      res.send("INDEX");
    },

    show: function(req, res) {
      res.send("Show " + req.params.invitation_id)
    },

    create: function(req, res) {
      res.send("CREATE " + req.body);
    },

    update: function(req, res) {
      res.send("UPDATE " + req.params.invitation_id);
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.invitation_id);
    }
  };

}())
