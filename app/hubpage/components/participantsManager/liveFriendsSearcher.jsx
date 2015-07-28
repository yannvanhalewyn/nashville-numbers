(function() {

  "use strict";

  var React = require('react')
    , FriendsSearchField = require('./friendsSearchField.jsx')
    , FriendsSuggestionsDropdown = require('./friendsSuggestionsDropdown.jsx')

  var LiveFriendsSearcher = React.createClass({
    getInitialState: function() {
      return {hideDropdown: false};
    },

    render: function() {
      return (
        <div
          onMouseLeave={this._onMouseLeave}
          onMouseEnter={this._onMouseEnter}
          className="live-friends-searcher"
        >
          <FriendsSearchField />
          {this.state.hideDropdown ? null : <FriendsSuggestionsDropdown friends={this.props.friends} />}
        </div>
      )
    },

    _onMouseLeave: function() {
      this.setState({hideDropdown: true});
    },

    _onMouseEnter: function() {
      this.setState({hideDropdown: false});
    }
  });

  module.exports = LiveFriendsSearcher;

}())
