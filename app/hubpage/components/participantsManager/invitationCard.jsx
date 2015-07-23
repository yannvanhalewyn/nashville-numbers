(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')
    , PermissionsSelector = require('./permissionsSelector.jsx')

  var InvitationCard = React.createClass({
    render: function() {
      return (
        <li className="invitation-card grid">
          <span className="col-4-12 name">{this.props.firstName} {this.props.lastName}</span>
          <div className="col-2-12">
            <img src={this.props.thumb} alt="user profile picture" />
          </div>
          <div className="permissions col-3-12">
            <PermissionsSelector onChange={this._onSelect} currentPermissions={this.props.permissions}/>
          </div>
          <div className="col-3-12">
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
