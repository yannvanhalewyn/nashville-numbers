(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/userpageActions')

  var AddFriendButton = React.createClass({
    render: function() {
      return <button className="btn" onClick={this._onClick}>Add Friend</button>;
    },

    _onClick: function() {
      Actions.sendFriendRequest();
    }
  });

  module.exports = AddFriendButton;

}())
