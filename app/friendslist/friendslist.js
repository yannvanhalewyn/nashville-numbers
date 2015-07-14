(function() {

  "use strict";

  var React              = require('react')
    , FriendsList        = require('./components/friendsList.react')
    , UserStore          = require('./stores/userStore')
    , FriendRequestStore = require('./stores/friendsRequestStore')

  React.render(
    <FriendsList userStore={UserStore} friendRequestStore={FriendRequestStore}/>,
    document.getElementById('friendslist-container')
  )

}())
