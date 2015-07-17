(function() {

  "use strict";

  var React = require('react')

  var UserStatsComponent = React.createClass({

    render: function() {
      return (
        <div className="user-stats col-2-4">
          <span className={"emblem " + this.props.insignia}></span>
          <div className="statistics">
            <ul>
              <li><strong>Sheets: </strong>{this.props.numSheets}</li>
              <li><strong>Friends: </strong>{this.props.numFriends}</li>
              <li><strong>Points: </strong>{this.props.points}</li>
            </ul>
          </div>
        </div>
      )
    }
  });

  module.exports = UserStatsComponent;

}())
