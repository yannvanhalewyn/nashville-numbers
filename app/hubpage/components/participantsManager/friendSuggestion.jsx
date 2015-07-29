(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')

  var FriendSuggestion = React.createClass({
    render: function() {
      return (
        <li className="suggestion">
          <img src={this.props.thumb} alt="friend profile picture" />
          <span className="name">{this.props.firstName} {this.props.lastName}</span>
          <button onClick={this._onInvite} className="btn"><span className="fa fa-plus" /> Invite</button>
        </li>
      )
    },

    _onInvite: function() {
      Actions.inviteFriend(this.props._id)
    }

  });

  module.exports = FriendSuggestion;

}())
