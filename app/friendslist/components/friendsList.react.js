(function() {

  "use strict";

  var React = require('react')
    , LiveUserSearch = require('./liveUserSearch.react')
    , PendingFriendRequests = require('./pendingFriendRequests.react')

  var FriendsListComponent = React.createClass({
    render: function() {
      return (
        <div>
          <LiveUserSearch
            store={this.props.userStore}
          />
          <PendingFriendRequests store={this.props.friendRequestStore} />
          <h1>Your Friends</h1>
          <p>Some list of friends goes here</p>
        </div>
      )
    }
  })

  module.exports = FriendsListComponent;

}())
