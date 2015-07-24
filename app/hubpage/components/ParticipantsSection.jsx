(function() {

  "use strict";

  var React = require('react')
    , ParticipantsManagementModal = require('./participantsManager/participantsManagementModal.jsx')

  var ParticipantsSectionComponent = React.createClass({
    renderParticipant: function(participant) {
      var status = participant.relationship.type == "CREATED" ? "Creator" : "Participant"
      return (
        <a href={"/users/" + participant._id} className="participant-preview">
          <img src={participant.properties.thumb} alt="participant profile thumbnail" />
          <div className="participant-info">
            <h4 className="participant-name">{participant.properties.firstName}</h4>
            <p className="participant-status">{status}</p>
          </div>
        </a>
      )
    },

    render: function() {
      return (
        <div className="participants-section">
          <h2>Participants ({this.props.numParticipants})</h2>
          <div className="participants-management">
            <label htmlFor="participant-modal-trigger" className="btn manage-participants-button"><span className="fa fa-pencil" /> Manage</label>
            <input id="participant-modal-trigger" type="checkbox" />
            <ParticipantsManagementModal
              participants={this.props.participants}
              friends={this.props.friends}
              invitations={this.props.invitations}
            />
          </div>
          <div className="participants-viewer">
            {this.props.participants.map(this.renderParticipant)}
          </div>
        </div>
      )
    }
  });

  module.exports = ParticipantsSectionComponent;

}())
