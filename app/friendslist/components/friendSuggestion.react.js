(function() {

  "use strict";

  var React = require('react')
    , FriendActions = require('../actions/friendActions')

  var FriendSuggestionComponent = React.createClass({
    render: function() {
      console.log(this.props)
      return (
        <a className="friend-suggestion" href={"/users/" + this.props._id}>
          <div className="suggestion-container">
            <img className="picture" src={this.props.picture} />
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
