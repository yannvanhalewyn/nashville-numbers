(function() {

  "use strict";

  var React     = require('react')
    , SearchBar = require('./searchBar.react')
    , FriendActions = require('../actions/friendActions')
    , FriendSuggestions = require('./friendSuggestions.react')

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

    render: function() {
      return (
        <div className="live-user-search">
          <SearchBar onInput={this._onInput}/>
          <FriendSuggestions users={this.state.users} />
        </div>
      )
    },

    // TODO: Optimise this. (eg: when results < 10 cache it and only rerequest when keycount
    // drops below what it was on cache, when more keys are pressed recalculate from cache.)
    _onInput: function(e) {
      var value = e.target.value;
      if (value.length === 0) {
        return this.setState({users: []});
      } else if (value.length > 1) {
        return FriendActions.searchForUsers(value);
      }
    }
  })

  module.exports = LiveUserSearchComponent;

}())
