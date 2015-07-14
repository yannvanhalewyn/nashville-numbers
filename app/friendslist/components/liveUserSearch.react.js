(function() {

  "use strict";

  var React     = require('react')
    , SearchBar = require('./searchBar.react')
    , FriendActions = require('../actions/friendActions')
    , FriendSuggestion = require('./friendSuggestion.react')

  var LiveUserSearchComponent = React.createClass({
    getInitialState: function() {
      return { users: this.props.userStore.getUsers() }
    },

    componentWillMount: function() {
      this.props.userStore.on('update', this.update);
    },

    componentWillUnmount: function() {
      this.props.userStore.off('update', this.update);
    },

    update: function(foo) {
      this.setState({users: this.props.userStore.getUsers()})
    },

    renderFriendSuggestion: function(user) {
      return (
        <FriendSuggestion
          firstName={user.properties.firstName}
          lastName={user.properties.lastName}
          _id={user._id}
        />
      )
    },

    render: function() {
      return (
        <div>
          <SearchBar onInput={this._onInput}/>
          {this.state.users.map(this.renderFriendSuggestion)}
        </div>
      )
    },

    _onInput: function(e) {
      var value = e.target.value;
      FriendActions.searchForUsers(value);
    }
  })

  module.exports = LiveUserSearchComponent;

}())
