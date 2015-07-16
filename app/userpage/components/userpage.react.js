(function() {

  "use strict";

  var React      = require('react')
    , UserHeader = require('./userHeader.react')

  var UserPageComponent = React.createClass({
    getInitialState: function() {
      return this.props.userStore.getState();
    },

    // COULD DO friendrequest on 'request' to have a temporary label
    // And catch the 'sync' later to set the label
    componentDidMount: function() {
      this.props.userStore.on('update sync', this.updateUser);
      this.props.friendRequestModel.on('sync', this.updateFriendship);
      this.props.friendshipModel.on('sync', this.updateFriendship);
    },

    componentDidUnmount: function() {
      this.props.userStore.off('update sync', this.updateUser);
      this.props.friendRequestModel.off('sync', this.updateFriendship);
      this.props.friendshipModel.on('sync', this.updateFriendship);
    },

    updateUser: function() {
      this.setState(this.props.userStore.getState());
    },

    updateFriendship: function(update, response) {
      console.log('sync');
      switch (response.type) {
        case 'sent':
          this.setState({friendship: {sentRequest: update.get('request')}});
          break;

        case 'accepted':
          this.setState({friendship: {friendship: update.get('relationship')}})
          break;

        case 'destroyed':
          this.setState({friendship: {}})
          break;

        default:
          console.error("Got invalid update type " + response.type);
          break;
      }
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
