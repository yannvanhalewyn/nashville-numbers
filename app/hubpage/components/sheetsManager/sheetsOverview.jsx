(function() {

  "use strict";

  var React = require('react')
    , SheetCard = require('./sheetCard.jsx')

  var SheetsOverview = React.createClass({
    proptypes: {
      sheets: React.PropTypes.array
    },

    renderSheetCard: function(sheet) {
      return (
        <SheetCard
          title={sheet.properties.title}
          artist={sheet.properties.artist}
          _id={sheet._id}
        />
      )
    },

    render: function() {
      return (
        <ul className="list sheets-overview-list">
          {this.props.sheets.map(this.renderSheetCard)}
        </ul>
      )
    }
  });

  module.exports = SheetsOverview;

}())
