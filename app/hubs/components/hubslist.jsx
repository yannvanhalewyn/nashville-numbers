(function() {

  "use strict";

  var React = require('react')
    , HubListing = require('./hubListing.jsx')

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
        <div className="hubs-list">
          {this.props.hubs.map(this.renderHubListing)}
        </div>
      )
    }
  });

  module.exports = HubsList;

}())
