(function() {

  "use strict";

  var React   = require('react')
    , Actions = require('../../actions/userpageActions')

  var RequestPendingLabel = React.createClass({
    render: function() {
      return (
        <div>
          <p className="message">Request sent!</p>
          <div className="btn btn-red friendship-button" onClick={this._onCancel}>
            <span className="fa fa-times"></span> Cancel
          </div>
        </div>
      );
    },

    _onCancel: function() {
      Actions.cancelFriendRequest();
    }

  });

  module.exports = RequestPendingLabel;

}())
