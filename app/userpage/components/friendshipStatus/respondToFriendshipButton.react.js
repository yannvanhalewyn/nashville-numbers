(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/userpageActions');

  var RespondToFriendshipButton = React.createClass({
    render: function() {
      return (
        <div className="dropdown">
          <p className="message">has sent you a friend request.</p>
          <button className="btn btn-red friendship-button" onClick={this._onDecline}>Decline</button>
          <button className="btn friendship-button" onClick={this._onAccept}>Accept</button>
        </div>
      )
    },

    _onDecline: function() {
      Actions.declineFriendRequest();
    },

    _onAccept: function() {
      Actions.acceptFriendRequest();
    }
  });

  module.exports = RespondToFriendshipButton;

}())
