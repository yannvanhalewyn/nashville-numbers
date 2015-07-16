(function() {

  "use strict";

  var Backbone   = require('backbone')
    , Dispatcher = require('../dispatcher/usersDispatcher')
    , Constants  = require('../actions/friendActions').constants

  var UserModel = Backbone.Model.extend({});

  var UserCollection = Backbone.Collection.extend({
    model: UserModel,
    url: "/users",

    initialize: function() {
      this.dispatchToken = Dispatcher.register(this.dispatchCallback.bind(this));
    },

    dispatchCallback: function(payload) {
      switch (payload.actionType) {
        case Constants.SEARCH_FOR_USERS:
          this.fetch({data: {search: payload.searchValue}});
          break;

        default:
          console.error("No such action -- " + payload.actionType);
      }
    },

    getUsers: function() {
      return this.models.map(function(m) {
        return m.attributes;
      });
    }
  })

  module.exports = new UserCollection();

}())
