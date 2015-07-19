(function() {

  "use strict";

  var React = require('react')
    , Header = require('./Header.jsx')
    , SheetsSection = require('./SheetsSection.jsx')
    , ParticipantsSection = require('./ParticipantsSection.jsx')

  var HubPageComponent = React.createClass({
    componentDidMount: function() {
      this.props.store.on('participants:sync', this._onParticipantsSync);
    },

    getInitialState: function() {
      return { participants: [] }
    },

    render: function() {
      return (
        <div>
          <Header />
          <SheetsSection />
          <ParticipantsSection participants={this.state.participants}/>
        </div>
      )
    },

    _onParticipantsSync: function(foo, bar) {
      this.setState({participants: bar});
    }
  });

  module.exports = HubPageComponent;

}())
