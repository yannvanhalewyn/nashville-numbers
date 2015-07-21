(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')

  var FriendSuggestion = React.createClass({
    render: function() {
      return (
        <div className="friend-suggestion">
          <img src={this.props.thumb} alt="friend profile picture" />
          <h2>{this.props.firstName} {this.props.lastName}</h2>
          <button onClick={this._onInvite} className="btn">Invite</button>
        </div>
      )
    },

    _onInvite: function() {
      Actions.inviteFriend(this.props._id)
    }

  });

  module.exports = FriendSuggestion;

}())
