(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')

  var FriendsSearchField = React.createClass({
    render: function() {
      return (
        <div className="search-field">
          <span className="fa fa-search"></span>
          <input onChange={this._onChange} type="text" placeholder="Find friends.." />
        </div>
      )
    },

    _onChange: function(e) {
      Actions.updateFriendsList(e.target.value);
    }

  });

  module.exports = FriendsSearchField;

}())
