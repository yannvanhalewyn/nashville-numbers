(function() {

  var include                      = require('include')
    , ensureAuth                   = include('/middlewares/auth')
    , getTargetHubWithRelationship = include('/middlewares/hubs/getTargetHubWithRelationship')
    , ensureCreated                = include('/middlewares/hubs/ensureCreated')
    , errorStatus                  = include('/middlewares/errors/errorStatus')

  module.exports = {

    middlewares: {
      index:   [ensureAuth],
      show:    [ensureAuth, getTargetHubWithRelationship],
      create:  [ensureAuth],
      update:  [],
      destroy: [ensureAuth, getTargetHubWithRelationship, ensureCreated]
    },

    index: function(req, res) {
      req.user.getHubs().then(function(hubs) {
        res.render('hubs', {hubs: JSON.stringify(hubs)});
      });
    },

    show: function(req, res) {
      res.render('hub', {state: JSON.stringify({
        hub: req.target_hub, relationship: req.target_hub_relationship_to_user
      })});
    },

    create: function(req, res) {
      req.user.createHub(req.body.name).then(function(hub) {
        res.redirect("/hubs/" + hub._id);
      });
    },

    update: function(req, res) {
      res.send("UPDATE " + req.params.hub_id);
    },

    destroy: function(req, res) {
      req.target_hub.destroy().then(function() {
        if (req.xhr) {
          return res.json({destroyed: true});
        }
        return res.redirect("/hubs");
      });
    }
  };

}())
