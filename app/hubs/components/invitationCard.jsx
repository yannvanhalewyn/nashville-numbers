(function() {

  "use strict";

  var React = require('react');

  var InvitationCard = React.createClass({
    render: function() {
      return (
        <p>
          {this.props.sender.properties.firstName} has invited you to join {this.props.hub.properties.name}
        </p>
      )
    }
  });

  module.exports = InvitationCard;

}())
