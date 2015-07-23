(function() {

  "use strict";

  var React = require('react')
    , ParticipantCard = require('./participantCard.jsx')

  var Participants = React.createClass({
    renderParticipantCard: function(participant) {
      return (
        <ParticipantCard
          firstName={participant.user.properties.firstName}
          lastName={participant.user.properties.lastName}
          relationship={participant.relationship}
          thumb={participant.user.properties.thumb}
        />
      )
    },

    render: function() {
      return (
        <div className="col-2-4 participants">
          <h2>PARTICIPANTS</h2>
          <ul className="list">
            {this.props.participants.map(this.renderParticipantCard)}
          </ul>
        </div>
      )
    }
  });

  module.exports = Participants;

}())
