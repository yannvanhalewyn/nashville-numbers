(function() {

  "use strict";

  var React      = require('react')
    , UserHeader = require('./userHeader.jsx')
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
      // TMP random insignia generator just for fun
      var insigniae = [
        "beginner-sheeter", "score-specialist",
        "sheet-ninja", "corporal-mcsheeter",
        "eagle-eyed-sheeter", "president-jimmy-charter",
        "sheeter-by-the-boatload", "casual-cheetah"
      ];
      var randomInsignia = insigniae[Math.floor(Math.random() * insigniae.length)];
      var dummyStats = {
        insignia: randomInsignia,
        numSheets: 13,
        numFriends: 53,
        points: 986
      };
      return (
        <div className="userpage">
          <UserHeader
            firstName={this.state.userData.firstName}
            lastName={this.state.userData.lastName}
            picture={this.state.userData.picture}
            friendship={this.state.friendship}
            stats={dummyStats}
          />
          <h2>His Sheets</h2>
          <p>Here should be this dude's sheets</p>
        </div>
      )
    }
  });

  module.exports = UserPageComponent;

}())
