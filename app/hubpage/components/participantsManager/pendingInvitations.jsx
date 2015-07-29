(function() {

  "use strict";

  var React = require('react')
    , InvitationCard = require('./invitationCard.jsx')

  var PendingInvitations = React.createClass({
    renderInvitationCard: function(invitation) {
      return (
        <InvitationCard
          key={invitation._id}
          firstName={invitation.invitee.properties.firstName}
          lastName={invitation.invitee.properties.lastName}
          thumb={invitation.invitee.properties.thumb}
          permissions={invitation.properties.permissions}
          _id={invitation._id}
        />
      )
    },

    render: function() {
      return (
        <div className="pending-invitations">
          <h2>INVITATIONS</h2>
          <ul className="list">
            {this.props.invitations.map(this.renderInvitationCard)}
          </ul>
        </div>
      )
    }
  });

  module.exports = PendingInvitations;

}())
