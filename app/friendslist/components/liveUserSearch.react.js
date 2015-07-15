(function() {

  "use strict";

  var React     = require('react')
    , SearchBar = require('./searchBar.react')
    , FriendActions = require('../actions/friendActions')
    , FriendSuggestion = require('./friendSuggestion.react')

  var LiveUserSearchComponent = React.createClass({
    getInitialState: function() {
      return { users: this.props.store.getUsers() }
    },

    componentWillMount: function() {
      this.props.store.on('update', this.update);
    },

    componentWillUnmount: function() {
      this.props.store.off('update', this.update);
    },

    update: function(foo) {
      this.setState({users: this.props.store.getUsers()})
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
      if (value.length === 0) {
        return this.setState({users: []});
      } else if (value.length > 2) {
        return FriendActions.searchForUsers(value);
      }
    }
  })

  module.exports = LiveUserSearchComponent;

}())
