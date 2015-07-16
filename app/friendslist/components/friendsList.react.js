(function() {

  "use strict";

  var React = require('react')
    , LiveUserSearch = require('./liveUserSearch.react')
    , PendingFriendRequests = require('./pendingFriendRequests.react')

  var FriendsListComponent = React.createClass({
    render: function() {
      return (
        <div>
          <h1>Friends</h1>
          <LiveUserSearch
            store={this.props.userStore}
          />
          <PendingFriendRequests store={this.props.friendRequestStore} />
          <p>Some list of friends goes here</p>
        </div>
      )
    }
  })

  module.exports = FriendsListComponent;

}())
