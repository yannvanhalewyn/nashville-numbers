(function() {

  "use strict";

  var React = require('react')
    , LeaveHubButton = require('./leaveHubButton.jsx')
    , DestroyHubButton = require('./destroyHubButton.jsx')

  var HeaderComponent = React.createClass({
    propTypes: {
      hub: React.PropTypes.object,
      relationship: React.PropTypes.objec
    },

    renderLeaveOrDestroyHubButton: function() {
      if (this.props.hub.relationshipToUser.type === "CREATED") {
        return <DestroyHubButton hubID={this.props.hub._id} />
      }
      return <LeaveHubButton hubID={this.props.hub._id} />
    },

    render: function() {
      return (
        <div className="hub-header">
          <div className="hub-info">
            <h1>{this.props.hub.properties.name}</h1>
            {this.renderLeaveOrDestroyHubButton()}
            <p>{this.props.numParticipants} participants</p>
          </div>
        </div>
      )
    }
  });

  module.exports = HeaderComponent;

}())
