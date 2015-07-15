(function() {

  "use strict";

  var React = require('react')
    , FriendActions = require('../actions/friendActions')

  var FriendSuggestionComponent = React.createClass({
    render: function() {
      return (
        <div className="friend-suggestion">
          <div className="name">
            {this.props.firstName} {this.props.lastName}
          </div>
        </div>
      )
    }
  })

  module.exports = FriendSuggestionComponent;

}())
