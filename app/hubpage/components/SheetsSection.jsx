(function() {

  "use strict";

  var React = require('react')
    , LiveSheetsSearcher = require('./sheetsManager/liveSheetsSearcher.jsx')
    , SheetCard = require('./sheetCard.jsx')

  var SheetsSectionComponent = React.createClass({
    propTypes: {
      usersSheets: React.PropTypes.array,
      sheets: React.PropTypes.array,
      hubID: React.PropTypes.number
    },

    renderSheetCard: function(sheet) {
      return (
        <SheetCard
          title={sheet.properties.title}
          artist={sheet.properties.artist}
          private={sheet.properties.private}
          dbid={sheet._id}
          author={sheet.author}
          hubID={this.props.hubID}
        />
      )
    },

    render: function() {
      return (
        <div className="sheets-section">
          <h2>Sheets</h2>
          <LiveSheetsSearcher sheets={this.props.usersSheets} />
          <div className="sheets-section">
            {this.props.sheets.map(this.renderSheetCard)}
          </div>
        </div>
      )
    }
  });

  module.exports = SheetsSectionComponent;

}())
