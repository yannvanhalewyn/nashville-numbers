(function() {

  "use strict";

  var Backbone = require('backbone');

  var UserStore = Backbone.Model.extend({
    initialize: function() {
      var jsonState = document.getElementById('initial_state').text;
      this.attributes = JSON.parse(jsonState);
      this.url = "/users/" + this.attributes._id;
    },

    getState: function() {
      return this.attributes;
    }
  });

  module.exports = new UserStore();

}())
