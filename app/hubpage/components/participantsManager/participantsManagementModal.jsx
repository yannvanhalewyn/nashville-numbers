(function() {

  "use strict";

  var React = require('react')
    , LiveFriendsSearcher = require('./liveFriendsSearcher.jsx')
    , PendingInvitations = require('./pendingInvitations.jsx')
    , Participants = require('./participants.jsx')

  var ParticipantsManagementModal = React.createClass({
    render: function() {
      return (
        <div className="modal-overlay">
          <div className="modal-wrap participants-management-modal">
            <label htmlFor="participant-modal-trigger"><span className="fa fa-times modal-close-trigger"></span></label>
            <LiveFriendsSearcher friends={this.props.friends}/>
            <div className="overview grid">
              <PendingInvitations invitations={this.props.invitations} />
              <Participants participants={this.props.participants} />
            </div>
          </div>
        </div>
      )
    }
  });

  module.exports = ParticipantsManagementModal;

}())
