(function() {

  "use strict";

  var Backbone = require('backbone');

  var HubSheetsModel = Backbone.Model.extend({});

  var HubSheetsCollection = Backbone.Collection.extend({
    model: HubSheetsModel,

    initialize: function(unused, params) {
      this.url = "/hubs/" + params.hubID + "/sheets"
    }

  });

  module.exports = HubSheetsCollection;

}())
