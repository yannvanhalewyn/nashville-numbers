(function() {

  "use strict";

  var React = require('react')
    , FriendActions = require('../actions/friendActions')

  var FriendSuggestionComponent = React.createClass({
    render: function() {
      return (
        <a className="friend-suggestion" href={"/users/" + this.props._id}>
          <div className="suggestion-container">
            <img className="picture" src={this.props.thumb} />
            <span className="name">
              {this.props.firstName} {this.props.lastName}
            </span>
          </div>
        </a>
      )
    }
  })

  module.exports = FriendSuggestionComponent;

}())
