(function() {

  "use strict";

  var React = require('react');

  var SearchBar = React.createClass({
    render: function() {
      return (
      	<input 
    			type="text" 
    			className="user-search-field"
    			onInput={this.props.onInput} 
    			placeholder="Find friends" 
    		/>
      );
    }

  })

  module.exports = SearchBar;

}())
