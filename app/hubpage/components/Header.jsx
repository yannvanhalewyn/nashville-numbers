(function() {

  "use strict";

  var React = require('react')
    , LeaveHubButton = require('./leaveHubButton.jsx')

  var HeaderComponent = React.createClass({
    render: function() {
      return (
        <div className="grid hub-header">
          <div className="hub-info">
            <h1>{this.props.hub.properties.name}</h1>
            <LeaveHubButton hubID={this.props.hub._id} />
            <p>{this.props.numParticipants} participants</p>
          </div>
        </div>
      )
    }
  });

  module.exports = HeaderComponent;

}())
