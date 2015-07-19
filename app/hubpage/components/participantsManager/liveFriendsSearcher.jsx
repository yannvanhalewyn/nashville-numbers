(function() {

  "use strict";

  var React = require('react')
    , FriendsSearchField = require('./friendsSearchField.jsx')
    , FriendsSuggestionsDropdown = require('./friendsSuggestionsDrowdown.jsx')

  var LiveFriendsSearcher = React.createClass({
    render: function() {
      return (
        <div className="live-friends-searcher">
          <FriendsSearchField />
          <FriendsSuggestionsDropdown friends={this.props.friends} />
        </div>
      )
    }
  });

  module.exports = LiveFriendsSearcher;

}())
