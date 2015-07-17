(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/userpageActions')

  var AddFriendButton = React.createClass({
    render: function() {
      return (
        <div className="btn friendship-button" onClick={this._onClick}>
          <span className="fa fa-plus"></span> Add Friend
        </div>
      )
    },

    _onClick: function() {
      Actions.sendFriendRequest();
    }
  });

  module.exports = AddFriendButton;

}())
