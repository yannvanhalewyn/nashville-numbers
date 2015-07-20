(function() {

  "use strict";

  var React = require('react');

  var PendingInvitations = React.createClass({
    renderInvitationCard: function(invitation) {
      return (
        <div className="invitation-card">
          <h2>{invitation.invitee.properties.firstName}</h2>
          <img src={invitation.invitee.properties.thumb} alt="user profile picture" />
          <button className="btn btn-red">Cancel</button>
        </div>
      )
    },

    render: function() {
      return (
        <div>
          <h1>Pending Invitations</h1>
          {this.props.invitations.map(this.renderInvitationCard)}
        </div>
      )
    }
  });

  module.exports = PendingInvitations;

}())
