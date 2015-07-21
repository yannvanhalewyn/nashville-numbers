(function() {

  "use strict";

  var React = require('react')
    , InvitationCard = require('./invitationCard.jsx')

  var PendingInvitations = React.createClass({
    renderInvitationCard: function(invitation) {
      return (
        <InvitationCard
          key={invitation.cid}
          firstName={invitation.invitee.properties.firstName}
          thumb={invitation.invitee.properties.thumb}
          cid={invitation.cid}
        />
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
