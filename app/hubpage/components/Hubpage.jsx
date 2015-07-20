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
      this.props.store.on('invitations:sync', this._onInvitationsSync);
      this.props.store.on('friends:sync', this._onFriendsSync);
    },

    getInitialState: function() {
      return { participants: [], friends: [] }
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
          />
        </div>
      )
    },

    _onParticipantsSync: function(sender, participants) {
      this.setState({participants: participants});
    },

    _onFriendsSync: function(sender, friends) {
      this.setState({friends: friends});
    },

    _onInvitationsSync: function(sender, invitations) {
      console.log("SYNC: ", invitations);
    }
  });

  module.exports = HubPageComponent;

}())
