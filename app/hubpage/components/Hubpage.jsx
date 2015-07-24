(function() {

  "use strict";

  var React = require('react')
    , Header = require('./Header.jsx')
    , SheetsSection = require('./SheetsSection.jsx')
    , ParticipantsSection = require('./ParticipantsSection.jsx')

  var HubPageComponent = React.createClass({
    componentDidMount: function() {
      this.props.store.on('participants:sync participants:destroy ' +
                          'invitations:sync invitations:destroy friends:sync', this._update);
    },

    getInitialState: function() {
      return { participants: [], friends: [], invitations: [], hub: {properties: { name: "Hub" }} };
    },

    render: function() {
      var numParticipants = this.state.participants.length;
      return (
        <div>
          <Header hub={this.state.hub} numParticipants={this.state.participants.length} />
          <ParticipantsSection
            participants={this.state.participants}
            numParticipants={numParticipants}
            friends={this.state.friends}
            invitations={this.state.invitations}
          />
          <SheetsSection />
        </div>
      )
    },

    _update: function() {
      this.setState(this.props.store.getState());
    }
  });

  module.exports = HubPageComponent;

}())
