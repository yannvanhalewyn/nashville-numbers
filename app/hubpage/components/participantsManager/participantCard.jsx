(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')
    , PermissionsSelector = require('./permissionsSelector.jsx')

  var ParticipantCard = React.createClass({
    propTypes: {
      firstName: React.PropTypes.string,
      lastName: React.PropTypes.string,
      permissions: React.PropTypes.number,
      thumb: React.PropTypes.thumb
    },

    renderCreator: function() {
      return <li className="creator-card grid">
        <div className="col-2-12">
          <img src={this.props.thumb} alt="user profile picture" />
        </div>
        <span className="col-8-12 name">{this.props.firstName} {this.props.lastName}</span>
        <span className="col-2-12" >CREATOR</span>
      </li>
    },

    renderJoinee: function() {
      return (
        <li className="participant-card grid">
          <span className="col-4-12 name">{this.props.firstName} {this.props.lastName}</span>
          <div className="col-2-12">
            <img src={this.props.thumb} alt="user profile picture" />
          </div>
          <div className="permissions col-3-12">
            <PermissionsSelector onChange={this._onSelect} currentPermissions={this.props.relationship.properties.permissions}/>
          </div>
          <div className="col-3-12">
            <button className="btn btn-red" onClick={this._onBannishParticipant}><span className="fa fa-times" /> Banish</button>
          </div>
        </li>
      )
    },

    render: function() {
      if (this.props.relationship.type == "CREATED") {
        return this.renderCreator();
      }
      return this.renderJoinee();
    },

    _onBannishParticipant: function() {
      Actions.removeParticipant(this.props.cid);
    },

    _onSelect: function(permissionValue) {
      Actions.updateParticipantPermissions(this.props.cid, permissionValue);
    }
  });

  module.exports = ParticipantCard;

}())
