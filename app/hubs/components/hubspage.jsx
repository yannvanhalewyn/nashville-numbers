(function() {

  "use strict";

  var React = require('react')
    , HubsList = require('./hubslist.jsx')
    , PendingInvitations = require('./pendingInvitations.jsx')

  var HubsPage = React.createClass({
    componentWillMount: function() {
      this.props.store.on('invitations:sync', this._update);
    },

    getInitialState: function() {
      return this.props.store.getState();
    },

    render: function() {
      return (
        <div>
          <h1>HubsPage</h1>
          <PendingInvitations invitations={this.state.invitations} />
          <HubsList hubs={this.state.hubs}/>
        </div>
      )
    },

    _update: function() {
      this.setState(this.props.store.getState());
    }
  });

  module.exports = HubsPage;

}())
