(function() {

  "use strict";

  var React = require('react')
    , Header = require('./Header.jsx')
    , SheetsSection = require('./SheetsSection.jsx')
    , ParticipantsSection = require('./ParticipantsSection.jsx')
    , Modal = require('../../utility_react_components/modal.react')

  // TODO maybe split the update functions up in GetStateParticipants and GetStateSheets?
  var HubPageComponent = React.createClass({
    componentDidMount: function() {
      this.props.store.on('participants:sync participants:destroy ' +
                          'invitations:sync invitations:destroy ' +
                          'friends:sync', this._updateParticipants);
      this.props.store.on('users-sheets:sync hub-sheets:sync ' +
                          'hub-sheets:destroy', this._updateSheets);
      this.props.store.on('modal-confirm', this._showModal);
      this.props.store.on('sync', this._update);
    },

    // TODO maybe make this stateless, and pass in props upon creation?
    getInitialState: function() {
      return {
        participants: [],
        friends: [],
        invitations: [],
        hub: this.props.store.getState(),
        usersSheets: [],
        sheets: []
      };
    },

    render: function() {
      var numParticipants = this.state.participants.length;
      return (
        <div>
          <Modal ref="confirmationModal" />
          <Header hub={this.state.hub} numParticipants={this.state.participants.length} />
          <ParticipantsSection
            participants={this.state.participants}
            numParticipants={numParticipants}
            friends={this.state.friends}
            invitations={this.state.invitations}
          />
          <SheetsSection
            hubID={this.state.hub._id}
            sheets={this.state.sheets}
            usersSheets={this.state.usersSheets}
          />
        </div>
      )
    },

    _update: function() {
      this.setState({hub: this.props.store.getState()});
    },

    _updateParticipants: function() {
      this.setState(this.props.store.getParticipantsState());
    },

    _updateSheets: function() {
      this.setState(this.props.store.getSheetsState());
    },


    _showModal: function(params) {
      this.refs.confirmationModal.setText({title: params.title, body: params.body});
      this.refs.confirmationModal.setSuccessCallback(params.onSuccess);
      this.refs.confirmationModal.slideOut();
    }

  });

  module.exports = HubPageComponent;

}())
