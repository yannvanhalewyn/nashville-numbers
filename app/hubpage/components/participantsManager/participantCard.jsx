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
          <span className="col-3-12 name">{this.props.firstName} {this.props.lastName}</span>
          <div className="col-2-12">
            <img src={this.props.thumb} alt="user profile picture" />
          </div>
          <div className="permissions col-5-12">
            <PermissionsSelector onChange={this._onSelect} currentPermissions={this.props.relationship.properties.permissions}/>
          </div>
          <button className="btn btn-red col-2-12" onClick={this._onBannishParticipant}><span className="fa fa-times" /> Banish</button>
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
      Actions.bannishParticipant(this.props.cid);
    },

    _onSelect: function(permissionValue) {
      Actions.updateParticipantPermissions(this.props.cid, permissionValue);
    }
  });

  module.exports = ParticipantCard;

}())
