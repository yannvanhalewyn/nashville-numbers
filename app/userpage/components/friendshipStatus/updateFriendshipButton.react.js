(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/userpageActions')
    , Modal = require('../../../utility_react_components/modal.react');

  var UpdateFriendshipButton = React.createClass({
    renderFriendshipLabel: function() {
      if (this.state.hoverOverLabel) {
        return <label className="friend-confirmed-label" onMouseOver={this.setState.bind(this, {hover: true})}><span className="fa fa-check" /> Friends</label>
      } else {
        return <label className="friend-confirmed-label" onMouseOver={this.setState.bind(this, {hover:false})}><span className="fa fa-check" /> Friends</label>
      }
    },
    render: function() {
      return (
        <div>
          <label className="friend-confirmed-label" onClick={this._friendshipLabelClicked}></label>
          <Modal
            title="Delete friendship?"
            body="Are you sure you're not friends, buddy?"
            ref="deleteConfirmationModal"
            onConfirm={this._deleteFriend}
          />
        </div>
      )
    },

    _friendshipLabelClicked: function() {
      console.log("CLICK");
      this.refs.deleteConfirmationModal.slideOut();
    },

    _deleteFriend: function() {
      Actions.deleteFriend();
    },

    _onHover: function() {
      console.log("HOVER");
    }
  });

  module.exports = UpdateFriendshipButton;

}())
