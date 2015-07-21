(function() {

  "use strict";

  var React = require('react')
    , Header = require('./Header.jsx')
    , SheetsSection = require('./SheetsSection.jsx')
    , ParticipantsSection = require('./ParticipantsSection.jsx')
    , ParticipantsManagementModal = require('./participantsManager/participantsManagementModal.jsx')

  var HubPageComponent = React.createClass({
    componentDidMount: function() {
      this.props.store.on('participants:sync', this._onParticipantsSync);
      this.props.store.on('friends:sync invitations:sync invitations:destroy', this._update);
    },

    getInitialState: function() {
      return { participants: [], friends: [], invitations: [] }
    },

    render: function() {
      return (
        <div>
          <Header />
          <SheetsSection />
          <ParticipantsSection participants={this.state.participants}/>
          <ParticipantsManagementModal
            participants={this.state.participants}
            friends={this.state.friends}
            invitations={this.state.invitations}
          />
        </div>
      )
    },

    _onParticipantsSync: function(sender, participants) {
      this.setState({participants: participants});
    },

    _update: function() {
      this.setState(this.props.store.getState());
    }
  });

  module.exports = HubPageComponent;

}())
