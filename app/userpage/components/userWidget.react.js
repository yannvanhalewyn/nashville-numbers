(function() {

  "use strict";

  var React = require('react')
    , FriendshipStatus = require('./friendshipStatus.react')

  var UserWidgetComponent = React.createClass({
    render: function() {
      return (
        <div className="user-widget col-2-4">
          <img src={this.props.picture} alt={this.props.firstName + "'s profile picture"} />
          <div className="info">
            <h2>{this.props.firstName + " " + this.props.lastName}</h2>
            <FriendshipStatus friendship={this.props.friendship} />
          </div>
        </div>
      )
    }
  });

  module.exports = UserWidgetComponent;

}())
