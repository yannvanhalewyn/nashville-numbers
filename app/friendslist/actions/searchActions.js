(function() {

  "use strict";
  var keyMirror = require('keymirror')
    , Dispatcher = require('../dispatcher/usersDispatcher')

  var SearchConstants = keyMirror({
    SEARCH_FOR_USERS: null
  });

  var SearchActions = {
    searchForUsers: function(searchValue) {
      Dispatcher.dispatch({
        actionType: SearchConstants.SEARCH_FOR_USERS,
        searchValue: searchValue
      });
    }
  }

  module.exports = SearchActions;
  module.exports.constants = SearchConstants;

}())
