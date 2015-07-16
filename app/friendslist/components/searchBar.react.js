(function() {

  "use strict";

  var React = require('react');

  var SearchBar = React.createClass({
    render: function() {
      return <input type="text" onInput={this.props.onInput} placeholder="Find your friends"></input>
    }

  })

  module.exports = SearchBar;

}())
