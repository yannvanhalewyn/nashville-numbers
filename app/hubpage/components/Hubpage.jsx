(function() {

  "use strict";

  var React = require('react')
    , Header = require('./Header.jsx')
    , SheetsSection = require('./SheetsSection.jsx')
    , ParticipantsSection = require('./ParticipantsSection.jsx')
    , Modal = require('../../utility_react_components/modal.react')

  var HubPageComponent = React.createClass({
    componentDidMount: function() {
      this.props.store.on('participants:sync participants:destroy ' +
                          'invitations:sync invitations:destroy friends:sync', this._update);
      this.props.store.on('modal-confirm', this._showModal);
    },

    getInitialState: function() {
      return { participants: [], friends: [], invitations: [], hub: {properties: { name: "Hub" }} };
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
          <SheetsSection />
        </div>
      )
    },

    _update: function() {
      this.setState(this.props.store.getState());
    },

    _showModal: function(params) {
      this.refs.confirmationModal.setText({title: params.title, body: params.body});
      this.refs.confirmationModal.setSuccessCallback(params.onSuccess);
      this.refs.confirmationModal.slideOut();
    }
  });

  module.exports = HubPageComponent;

}())
