(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')

  var InvitationCard = React.createClass({
    render: function() {
      return (
        <div className="invitation-card">
          <h2>{this.props.firstName}</h2>
          <img src={this.props.thumb} alt="user profile picture" />
          <button className="btn btn-red" onClick={this._onCancelInvitation}>Cancel</button>
        </div>
      )
    },

    _onCancelInvitation: function() {
      Actions.cancelInvitation(this.props.cid);
    }
  });

  module.exports = InvitationCard;

}())
