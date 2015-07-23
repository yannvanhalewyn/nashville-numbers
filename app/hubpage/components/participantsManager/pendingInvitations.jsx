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
          permissions={invitation.properties.permissions}
          cid={invitation.cid}
        />
      )
    },

    render: function() {
      return (
        <div className="col-2-4 pending-invitations">
          <h1>Pending Invitations</h1>
          {this.props.invitations.map(this.renderInvitationCard)}
        </div>
      )
    }
  });

  module.exports = PendingInvitations;

}())
