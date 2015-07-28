(function() {

  "use strict";

  var React = require('react')
    , LiveSheetsSearcher = require('./sheetsManager/liveSheetsSearcher.jsx')

  var SheetsSectionComponent = React.createClass({
    propTypes: {
      usersSheets: React.PropTypes.array
    },

    render: function() {
      return (
        <div className="sheets-section">
          <h2>Sheets</h2>
          <LiveSheetsSearcher sheets={this.props.usersSheets} />
        </div>
      )
    }
  });

  module.exports = SheetsSectionComponent;

}())
