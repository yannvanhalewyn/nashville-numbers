(function() {

  "use strict";

  var React = require('react')
    , SheetCard = require('./sheetCard.jsx')
    , SheetManagementModal = require('./sheetsManager/sheetManagementModal.jsx')

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

          <div className="sheets-management">
            <input type="checkbox" id="sheets-modal-trigger" />
            <label className="btn" htmlFor="sheets-modal-trigger"><span className="fa fa-pencil" />Manage</label>
            <SheetManagementModal
              usersSheets={this.props.usersSheets}
              sheets={this.props.sheets}
            />
          </div>

          <ul className="list sheets-viewer">
            {this.props.sheets.map(this.renderSheetCard)}
          </ul>
        </div>
      )
    }
  });

  module.exports = SheetsSectionComponent;

}())
