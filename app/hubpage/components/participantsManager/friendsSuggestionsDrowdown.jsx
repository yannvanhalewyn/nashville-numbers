(function() {

  "use strict";

  var React = require('react');

  var FriendsSuggestionsDropdown = React.createClass({
    renderFriendSuggestion: function(friend) {
      return (
        <div>
          <img src={friend.properties.thumb} alt="friend profile picture" />
          <h2>{friend.properties.firstName} {friend.properties.lastName}</h2>
          <button className="btn">Invite</button>
        </div>
      )
    },

    render: function() {
      return (
        <div>
          {this.props.friends.map(this.renderFriendSuggestion)}
        </div>
      )
    }
  });

  module.exports = FriendsSuggestionsDropdown;

}())
