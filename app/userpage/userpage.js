(function() {

  "use strict";

  var React              = require('react')
    , UserPage           = require('./components/userpage.react')
    , UserStore          = require('./stores/userStore')
    , FriendRequestModel = require('./stores/friendRequestModel')
    , FriendshipModel = require('./stores/friendshipModel')

  React.render(
    <UserPage
      userStore={UserStore}
      friendRequestModel={FriendRequestModel}
      friendshipModel={FriendshipModel}
    />,
    document.getElementById('userpage-container')
  );

}())
