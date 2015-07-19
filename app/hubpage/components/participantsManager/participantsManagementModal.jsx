(function() {

  "use strict";

  var React = require('react')
    , LiveFriendsSearcher = require('./liveFriendsSearcher.jsx')

  var ParticipantsManagementModal = React.createClass({
    render: function() {
      return (
        <div className="modal participants-management-modal">
          <LiveFriendsSearcher friends={this.props.friends}/>
        </div>
      )
    }
  });

  module.exports = ParticipantsManagementModal;

}())
