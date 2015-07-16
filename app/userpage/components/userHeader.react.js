(function() {

  "use strict";

  var React = require('react')
  , FriendshipStatus = require('./friendshipStatus.react')

  var UserHeaderComponent = React.createClass({
    render: function() {
      return (
        <div>
          <h1>{this.props.firstName} {this.props.lastName}</h1>
          <FriendshipStatus friendship={this.props.friendship} />
        </div>
      );
    }
  });

  module.exports = UserHeaderComponent;

}())
