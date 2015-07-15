(function() {

  "use strict";

  var React = require('react')
  , FriendshipStatusbutton = require('./friendshipStatusbutton.react')

  var UserHeaderComponent = React.createClass({
    render: function() {
      return (
        <div>
          <h1>{this.props.firstName} {this.props.lastName}</h1>
          <FriendshipStatusbutton />
        </div>
      );
    }
  });

  module.exports = UserHeaderComponent;

}())
