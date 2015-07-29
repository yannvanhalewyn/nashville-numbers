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
      thumb: React.PropTypes.thumb,
      relationship: React.PropTypes.objec,
      _id: React.PropTypes.number
    },

    renderCreator: function() {
      return <li className="creator-card">
        <div className="thumb">
          <img src={this.props.thumb} alt="user profile picture" />
        </div>
        <span className="name">{this.props.firstName} {this.props.lastName}</span>
        <label className="" >CREATOR</label>
      </li>
    },

    renderJoinee: function() {
      return (
        <li className="participant-card">
          <span className="name">{this.props.firstName} {this.props.lastName}</span>
          <div className="thumb">
            <img src={this.props.thumb} alt="user profile picture" />
          </div>
          <div className="permissions">
            <PermissionsSelector onChange={this._onSelect} currentPermissions={this.props.relationship.properties.permissions}/>
          </div>
          <div className="button">
            <button className="btn btn-red" onClick={this._onRemoveClicked}><span className="fa fa-times" /> Banish</button>
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

    _onSelect: function(permissionValue) {
      Actions.updateParticipantPermissions(this.props._id, permissionValue);
    },

    _onRemoveClicked: function() {
      console.log(this.props._id);
      var title = "You're about to remove a participant.";
      var body = "Are you sure you want to remove " + this.props.firstName + " from this hub?";
      Actions.showConfirmationModal(title, body, Actions.removeParticipant.bind(null, this.props._id));
    }
  });

  module.exports = ParticipantCard;

}())
