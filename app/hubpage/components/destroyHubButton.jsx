(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../actions/hubpageActions');

  var DestroyHubButton = React.createClass({
    propTypes: {
      hubID: React.PropTypes.number
    },

    render: function() {
      return (
        <div>
          <form action={"/hubs/" + this.props.hubID} method="POST" ref="destroyForm" >
            <input type="hidden" value="DELETE" name="_method"/>
          </form>
          <button className="btn btn-red" onClick={this._onClick}><span className="fa fa-times" /> Destroy Hub!</button>
        </div>
      )
    },

    _onClick: function() {
      Actions.showConfirmationModal(
        "Destroy this hub?", "This will destroy all the user and sheet relationships " +
        "to the hub. This will not destroy any sheets. Proceed?", this._execute
      );
    },

    _execute: function() {
      this.refs.destroyForm.getDOMNode().submit();
    }
  });

  module.exports = DestroyHubButton;

}())
