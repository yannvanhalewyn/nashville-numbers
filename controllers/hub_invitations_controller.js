(function() {

  module.exports = {
    index: function(req, res) {
      res.send("INDEX");
    },

    show: function(req, res) {
      res.send("Show " + req.params.invitation_id)
    },

    create: function(req, res) {
      req.user.inviteToHub(req.params.hub_id, req.body.other_user_id).then(function(invitation) {
        res.json(invitation);
      });
    },

    update: function(req, res) {
      res.send("UPDATE " + req.params.invitation_id);
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.invitation_id);
    }
  };

}())
