(function() {

  "use strict";

  var React   = require('react')
    , Actions = require('../../actions/userpageActions')

  var RequestPendingLabel = React.createClass({
    render: function() {
      return (
        <div>
          <p>Your request has been sent</p>
          <button className="btn" onClick={this._onCancel}>Cancel</button>
        </div>
      );
    },

    _onCancel: function() {
      Actions.cancelFriendRequest();
    }

  });

  module.exports = RequestPendingLabel;

}())
