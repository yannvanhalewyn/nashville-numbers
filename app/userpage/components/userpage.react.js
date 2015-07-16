(function() {

  "use strict";

  var React      = require('react')
    , UserHeader = require('./userHeader.react')
    , Backbone = require('backbone')

  var UserPageComponent = React.createClass({
    getInitialState: function() {
      return this.props.store.getState();
    },

    // COULD DO friendrequest on 'request' to have a temporary label
    // And catch the 'sync' later to set the label
    componentDidMount: function() {
      this.props.store.on('friendship:sync', this.updateFriendship);
    },

    componentDidUnmount: function() {
      this.props.store.off('sync', this.updateUser);
    },

    updateFriendship: function(sender, updatedValue) {
      this.setState({friendship: updatedValue});
    },

    render: function() {
      return (
        <div className="userpage">
          <UserHeader
            firstName={this.state.userData.firstName}
            lastName={this.state.userData.lastName}
            friendship={this.state.friendship}
          />
          <h2>His Sheets</h2>
          <p>Here should be this dude's sheets</p>
        </div>
      )
    }
  });

  module.exports = UserPageComponent;

}())
