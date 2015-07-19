(function() {

  "use strict";

  var React = require('react');

  var ParticipantsSectionComponent = React.createClass({
    renderParticipant: function(participant) {
      return (
        <div>
          <h2>{participant.user.properties.firstName}</h2>
          <p>{participant.relationship.type}</p>
          <p>{participant.relationship.properties.permission}</p>
        </div>
      )
    },

    render: function() {
      return (
        <div>
          {this.props.participants.map(this.renderParticipant)}
        </div>
      )
    }
  });

  module.exports = ParticipantsSectionComponent;

}())
