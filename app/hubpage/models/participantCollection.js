(function() {

  "use strict";

  var Backbone = require('backbone');

  var ParticipantModel = Backbone.Model.extend({});

  var ParticipantCollection = Backbone.Collection.extend({
    model: ParticipantModel,

    initialize: function(params) {
      this.url = "/hubs/" + params.hubID + "/participants"
    }
  });

  module.exports = ParticipantCollection;

}())
