(function() {

  "use strict";

  var Backbone = require('backbone');

  var UserSheetsModel = Backbone.Model.extend({});

  var UserSheetsCollection = Backbone.Collection.extend({
    model: UserSheetsModel,
    url: "/users/me/sheets"
  });

  module.exports = UserSheetsCollection;

}())
