(function() {

  "use strict";

  var React = require('react')
    , HubListing = require('./hublisting.jsx')

  var HubsList = React.createClass({
    renderHubListing: function(hub) {
      return (
        <HubListing
          name={hub.properties.name}
          type={hub.relation.type}
          _id={hub._id}
        />
      )
    },

    render: function() {
      return (
        <ul className="list hubs-list">
          {this.props.hubs.map(this.renderHubListing)}
        </ul>
      )
    }
  });

  module.exports = HubsList;

}())
