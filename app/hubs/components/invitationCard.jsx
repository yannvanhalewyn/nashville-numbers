(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../actions/hubActions')

  var InvitationCard = React.createClass({
    render: function() {
      return (
        <p>
          {this.props.sender.properties.firstName} has invited you to join {this.props.hub.properties.name}
          <button className="btn" onClick={this._onAccept}>Accept</button>
        </p>
      )
    },

    _onAccept: function(e) {
      Actions.acceptHubInvitation(this.props.cid);
    }
  });

  module.exports = InvitationCard;

}())
