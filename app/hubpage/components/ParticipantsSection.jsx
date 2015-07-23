(function() {

  "use strict";

  var React = require('react')
    , ParticipantsManagementModal = require('./participantsManager/participantsManagementModal.jsx')

  var ParticipantsSectionComponent = React.createClass({
    renderParticipant: function(participant) {
      var status = participant.relationship.type == "CREATED" ? "Creator" : "Participant"
      return (
        <a href={"/users/" + participant.user._id} className="participant-preview">
          <img src={participant.user.properties.thumb} alt="participant profile thumbnail" />
          <div className="participant-info">
            <h4 className="participant-name">{participant.user.properties.firstName}</h4>
            <p className="participant-status">{status}</p>
          </div>
        </a>
      )
    },

    render: function() {
      return (
        <div className="participants-section">
          <h2>Participants ({this.props.numParticipants})</h2>
          <button className="btn manage-participants-button"><span className="fa fa-pencil"> Manage</span></button>
          <div className="participants-viewer">
            {this.props.participants.map(this.renderParticipant)}
          </div>
          <ParticipantsManagementModal
            participants={this.props.participants}
            friends={this.props.friends}
            invitations={this.props.invitations}
          />
        </div>
      )
    }
  });

  module.exports = ParticipantsSectionComponent;

}())
