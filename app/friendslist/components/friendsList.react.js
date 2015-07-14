(function() {

  "use strict";

  var React = require('react')
    , LiveUserSearch = require('./liveUserSearch.react')

  var FriendsListComponent = React.createClass({
    render: function() {
      return (
        <div>
          <LiveUserSearch
            userStore={this.props.userStore}
            friendRequestStore={this.props.friendRequestStore}
          />
          <h1>Your Friends</h1>
          <p>Some list of friends goes here</p>
        </div>
      )
    }
  })

  module.exports = FriendsListComponent;

}())
