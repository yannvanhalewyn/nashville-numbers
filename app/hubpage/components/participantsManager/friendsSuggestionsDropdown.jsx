(function() {

  "use strict";

  var React = require('react')
    , FriendSuggestion = require('./friendSuggestion.jsx')

  var FriendsSuggestionsDropdown = React.createClass({
    renderFriendSuggestion: function(friend) {
      return (
        <FriendSuggestion
          key={friend._id}
          firstName={friend.properties.firstName}
          lastName={friend.properties.lastName}
          thumb={friend.properties.thumb}
          _id={friend._id}
        />
      )
    },

    render: function() {
      return (
        <div className="search-dropdown friend-suggestions">
          <ul>
            {this.props.friends.map(this.renderFriendSuggestion)}
          </ul>
        </div>
      )
    }
  });

  module.exports = FriendsSuggestionsDropdown;

}())
