(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../actions/hubpageActions');

  var LeaveHubButton = React.createClass({
    render: function() {
      return (
        <div>
          <form action={"/hubs/" + this.props.hubID + "/participants/me"} method="post" ref="leaveForm">
            <input type="hidden" value="DELETE" name="_method"/>
          </form>
          <button className="btn btn-red" onClick={this._onClick}>LEAVE</button>
        </div>
      )
    },

    _onClick: function() {
      Actions.showConfirmationModal("Leave this hub?", "You will have to be reinvited to come back!", this._execute);
    },

    _execute: function() {
      this.refs.leaveForm.getDOMNode().submit();
    }
  });

  module.exports = LeaveHubButton;

}())
