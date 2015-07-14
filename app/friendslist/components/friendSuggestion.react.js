(function() {

  "use strict";

  var React = require('react')
    , FriendActions = require('../actions/friendActions')

  var FriendSuggestionComponent = React.createClass({
    render: function() {
      return (
        <div className="friend-suggestion">
          <div className="name">
            {this.props.firstName} {this.props.lastName}
          </div>
          <span className="fa fa-plus" onClick={this._onClick}/>
        </div>
      )
    },

    _onClick: function() {
      FriendActions.sendFriendRequest(this.props._id);
    }
  })

  module.exports = FriendSuggestionComponent;

}())
