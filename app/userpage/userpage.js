(function() {

  "use strict";

  var React              = require('react')
    , UserPage           = require('./components/userpage.react')
    , UserStore          = require('./stores/userStore')
    , FriendRequestModel = require('./stores/friendRequestModel')

  React.render(
    <UserPage userStore={UserStore} friendRequestModel={FriendRequestModel}/>,
    document.getElementById('userpage-container')
  );

}())
