(function() {

  "use strict";

  var React = require('react')
    , UserWidget = require('./userWidget.jsx')
    , UserStats = require('./userStats.jsx');

  var UserHeaderComponent = React.createClass({
    render: function() {
      return (
        <div className="user-header">
          <UserWidget
            picture={this.props.picture}
            firstName={this.props.firstName}
            lastName={this.props.lastName}
            friendship={this.props.friendship}
          />
          <UserStats
            insignia={this.props.stats.insignia}
            numSheets={this.props.stats.numSheets}
            numFriends={this.props.stats.numFriends}
            points={this.props.stats.points}
          />
        </div>
      );
    }
  });

  module.exports = UserHeaderComponent;

}())
