(function() {

  "use strict";

  var React = require('react')
    , FriendshipStatus = require('./friendshipStatus.jsx')

  var UserWidgetComponent = React.createClass({
    render: function() {
      return (
        <div className="user-widget">
          <div className="profile-picture-wrap">
            <img className="profile-picture" src={this.props.picture} alt={this.props.firstName + "'s profile picture"} />
          </div>
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
