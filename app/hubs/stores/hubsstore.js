(function() {

  "use strict";

  var Backbone = require('backbone');

  var HubModel = Backbone.Model.extend({
    idAttribute: "_id",
  });

  var HubCollection = Backbone.Collection.extend({
    model: HubModel,
    url: "/hubs/",

    initialize: function() {
      var jsonState = document.getElementById('initial_state').text;
      var hubs = JSON.parse(jsonState);
      hubs.forEach(function(e) {
        var hub = new HubModel(e.hub);
        hub.relation = e.relation;
        this.add(hub);
      }.bind(this))
    },

    getState: function() {
      return {hubs: this.models.map(function(m) {
        return {
          _id: m.attributes._id,
          properties: m.attributes.properties,
          relation: m.relation
        }
      })};
    }
  });

  module.exports = new HubCollection();

}())
