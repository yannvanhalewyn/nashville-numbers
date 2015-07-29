(function() {

  "use strict";

  var React = require('react');

  var HubListing = React.createClass({
    render: function() {
      return (
        <li>
          <a href={"/hubs/" + this.props._id}>
            <h2>{this.props.name}</h2>
            <p>{this.props.type}</p>
          </a>
        </li>
      )
    }
  });

  module.exports = HubListing;

}())
