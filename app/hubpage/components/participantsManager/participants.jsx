(function() {

  "use strict";

  var React = require('react')
    , ParticipantCard = require('./participantCard.jsx')

  var Participants = React.createClass({
    renderParticipantCard: function(participant) {
      return (
        <ParticipantCard
          firstName={participant.properties.firstName}
          lastName={participant.properties.lastName}
          relationship={participant.relationship}
          thumb={participant.properties.thumb}
          cid={participant.cid}
        />
      )
    },

    render: function() {
      return (
        <div className="participants">
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
