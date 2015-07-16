(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/userpageActions');

  var UpdateFriendshipButton = React.createClass({
    render: function() {
      return (
        <div>
          <p>You are now Buddies!</p>
          <button className="btn" onClick={this._onDeleteFriend}>I'm not your buddy, friend.</button>
        </div>
      )
    },

    _onDeleteFriend: function() {
      Actions.deleteFriend();
    }
  });

  module.exports = UpdateFriendshipButton;

}())
