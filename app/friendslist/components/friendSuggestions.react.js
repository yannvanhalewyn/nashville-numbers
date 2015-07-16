(function() {

  "use strict";

  var React = require('react')
  , FriendSuggestion = require('./friendSuggestion.react')

  var FriendSuggestionsComponent = React.createClass({

    renderFriendSuggestion: function(user) {
      return (
        <FriendSuggestion
          firstName={user.properties.firstName}
          lastName={user.properties.lastName}
          picture={user.properties.picture}
          _id={user._id}
        />
      )
    },

    render: function() {
      if (!this.props.users.length) {
        return (<div />);
      }
      return (
        <div className="outer-dropdown">
          <div className="dropdown">
            {this.props.users.map(this.renderFriendSuggestion)}
          </div>
        </div>
      );
    }
  });

  module.exports = FriendSuggestionsComponent;

}())
