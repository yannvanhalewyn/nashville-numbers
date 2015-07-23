(function() {

  "use strict";

  var React = require('react');

  var HeaderComponent = React.createClass({
    render: function() {
      return (
        <div className="grid hub-header">
          <div className="hub-info">
            <h1>{this.props.hub.properties.name}</h1>
            <p>{this.props.numParticipants} participants</p>
          </div>
        </div>
      )
    }
  });

  module.exports = HeaderComponent;

}())
