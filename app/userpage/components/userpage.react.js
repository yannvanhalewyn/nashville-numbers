(function() {

  "use strict";

  var React      = require('react')
    , UserHeader = require('./userHeader.react')

  var UserPageComponent = React.createClass({
    getInitialState: function() {
      return this.props.store.getState();
    },

    componentDidMount: function() {
      this.props.store.on('update sync', this.update);
    },

    componentDidUnmount: function() {
      this.props.store.off('update sync', this.update);
    },

    update: function() {
      this.setState({userData: this.props.store.getState()});
    },

    render: function() {
      return (
        <div className="userpage">
          <UserHeader
            firstName={this.state.properties.firstName}
            lastName={this.state.properties.lastName}
          />
          <h2>His Sheets</h2>
          <p>Here should be this dude's sheets</p>
        </div>
      )
    }
  });

  module.exports = UserPageComponent;

}())
