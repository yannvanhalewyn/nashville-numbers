(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/userpageActions');

  var RespondToFriendshipButton = React.createClass({
    render: function() {
      return (
        <div className="dropdown">
          <p>Respond to friend request!</p>
          <button className="btn btn-orange" onClick={this._onDecline}>Decline</button>
          <button className="btn" onClick={this._onAccept}>Accept</button>
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
