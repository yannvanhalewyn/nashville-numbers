(function() {

  var include                      = require('include')
    , ensureAuth                   = include('/middlewares/auth')
    , getTargetHub                 = include('/middlewares/hubs/getTargetHub')
    , getTargetHubWithRelationship = include('/middlewares/hubs/getTargetHubWithRelationship')
    , getTargetSheetInHub          = include('/middlewares/hubs/getTargetSheetInHub')
    , errorStatus                  = include('/middlewares/errors/errorStatus')
    , redirect                     = include('/middlewares/errors/redirect')
    , reactRender                  = include('/helpers/reactRender')

  module.exports = {

    middlewares: {
      index:   [ensureAuth, getTargetHub, errorStatus(400)],
      show:    [ensureAuth, getTargetHubWithRelationship, getTargetSheetInHub, redirect.hub],
      create:  [ensureAuth, getTargetHub, errorStatus(400)],
      destroy: [ensureAuth, getTargetHub, errorStatus(400)]
    },

    index: function(req, res) {
      req.target_hub.getSheets().then(function(sheets) {
        res.json(sheets);
      });
    },

    show: function(req, res) {
      var markup = reactRender.sheet(req.target_sheet_in_hub);
      res.render("sheet", {markup: markup});
    },

    create: function(req, res) {
      req.target_hub.addSheet(req.body.sheet_id).then(function(entities) {
        res.json(entities.sheet);
      }, function(error) {
        res.status(400);
        res.send(error);
      });
    },

    destroy: function(req, res) {
      req.target_hub.removeSheet(req.params.sheet_id).then(function() {
        res.json({destroyed: true});
      }, function(error) {
        res.status(400);
        res.send(error);
      });
    }
  };

}())
