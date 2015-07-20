(function() {

  "use strict";

  var React = require('react')
    , LiveFriendsSearcher = require('./liveFriendsSearcher.jsx')
    , PendingInvitations = require('./pendingInvitations.jsx')

  var ParticipantsManagementModal = React.createClass({
    render: function() {
      return (
        <div className="modal participants-management-modal">
          <LiveFriendsSearcher friends={this.props.friends}/>
          <PendingInvitations invitations={this.props.invitations} />
        </div>
      )
    }
  });

  module.exports = ParticipantsManagementModal;

}())
