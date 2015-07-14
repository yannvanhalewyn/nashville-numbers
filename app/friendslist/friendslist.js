(function() {

  "use strict";

  var React = require('react')
    , FriendsList = require('./components/friendsList.react')
    , UserStore = require('./stores/userStore')

  React.render(
    <FriendsList userStore={UserStore}/>,
    document.getElementById('friendslist-container')
  )

}())
