(function() {

  "use strict";

  var React     = require('react')
    , SearchBar = require('./searchBar.react')
    , SearchActions = require('../actions/searchActions')

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

    renderUserSuggestion: function(user) {
      return (
        <p>{user._id} - {user.attributes.firstName}</p>
      )
    },

    render: function() {
      return (
        <div>
          <SearchBar onInput={this._onInput}/>
          {this.state.users.map(this.renderUserSuggestion)}
        </div>
      )
    },

    _onInput: function(e) {
      var value = e.target.value;
      SearchActions.searchForUsers(value);
    }
  })

  module.exports = LiveUserSearchComponent;

}())
