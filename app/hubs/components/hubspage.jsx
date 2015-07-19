(function() {

  "use strict";

  var React = require('react')
    , HubsList = require('./hubslist.jsx')

  var HubsPage = React.createClass({
    getInitialState: function() {
      return this.props.store.getState();
    },

    render: function() {
      return (
        <div>
          <h1>HubsPage</h1>
          <HubsList hubs={this.state.hubs}/>
        </div>
      )
    }
  });

  module.exports = HubsPage;

}())
