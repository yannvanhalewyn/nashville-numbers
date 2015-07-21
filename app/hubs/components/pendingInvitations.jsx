(function() {

  "use strict";

  var React = require('react')
    , InvitationCard = require('./invitationCard.jsx')

  var PendingInvitations = React.createClass({
    renderInvitationCard: function(invitation) {
      return  <InvitationCard
                invitation={invitation.invitation}
                sender={invitation.sender}
                hub={invitation.hub}
              />
    },

    render: function() {
      return (
        <div>
          {this.props.invitations.map(this.renderInvitationCard)}
        </div>
      )
    }
  });

  module.exports = PendingInvitations;

}())
