(function() {

  "use strict";

  var Backbone = require('backbone');

  var ParticipantModel = Backbone.Model.extend({
    idAttribute: "_id",
    parse: function(res) {
      var obj = res.user;
      obj.relationship = res.relationship;
      obj._id = res.user._id;
      return obj;
    }
  });

  var ParticipantCollection = Backbone.Collection.extend({
    model: ParticipantModel,

    initialize: function(params) {
      this.url = "/hubs/" + params.hubID + "/participants"
    }
  });

  module.exports = ParticipantCollection;

}())
