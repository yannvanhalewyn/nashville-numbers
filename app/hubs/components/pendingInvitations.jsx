(function() {

  "use strict";

  var React = require('react')
    , InvitationCard = require('./invitationCard.jsx')

  var PendingInvitations = React.createClass({
    renderInvitationCard: function(invitation) {
      return  <InvitationCard
                sender={invitation.sender}
                hub={invitation.hub}
                cid={invitation.cid}
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
