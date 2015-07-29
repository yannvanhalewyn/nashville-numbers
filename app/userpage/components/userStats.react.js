(function() {

  "use strict";

  var React = require('react')

  var UserStatsComponent = React.createClass({

    render: function() {
      return (
        <div className="user-stats">
          <span className={"emblem " + this.props.insignia}></span>
          <div className="stats">
            <ul>
              <li className="stat"><strong>Sheets: </strong>{this.props.numSheets}</li>
              <li className="stat"><strong>Friends: </strong>{this.props.numFriends}</li>
              <li className="stat"><strong>Points: </strong>{this.props.points}</li>
            </ul>
          </div>
        </div>
      )
    }
  });

  module.exports = UserStatsComponent;

}())
