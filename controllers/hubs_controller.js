(function() {

  module.exports = {
    index: function(req, res) {
      req.user.getHubs().then(function(hubs) {
        res.render('hubs', {hubs: JSON.stringify(hubs)});
      });
    },

    show: function(req, res) {
      res.send("SHOW " + req.params.hub_id);
    },

    create: function(req, res) {
      req.user.createHub(req.body.name).then(function(hub) {
        res.redirect("/hubs/" + hub._id);
      }).catch(res.send);
    },

    update: function(req, res) {
      res.send("UPDATE " + req.params.hub_id);
    },

    destroy: function(req, res) {
      res.send("DESTROY " + req.params.hub_id);
    }
  };

}())
