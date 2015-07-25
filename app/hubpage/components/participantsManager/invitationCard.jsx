(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')
    , PermissionsSelector = require('./permissionsSelector.jsx')

  var InvitationCard = React.createClass({
    render: function() {
      return (
        <li className="invitation-card">
          <span className="name">{this.props.firstName} {this.props.lastName}</span>
          <div className="thumb">
            <img src={this.props.thumb} alt="user profile picture" />
          </div>
          <div className="permissions">
            <PermissionsSelector onChange={this._onSelect} currentPermissions={this.props.permissions}/>
          </div>
          <div className="button">
            <button className="btn btn-red" onClick={this._onCancelInvitation}><span className="fa fa-times" /> Cancel</button>
          </div>
        </li>
      )
    },

    _onCancelInvitation: function() {
      Actions.cancelInvitation(this.props.cid);
    },

    _onSelect: function(permissionValue) {
      Actions.updateInvitedUserPermissions(this.props.cid, permissionValue);
    }
  });

  module.exports = InvitationCard;

}())
