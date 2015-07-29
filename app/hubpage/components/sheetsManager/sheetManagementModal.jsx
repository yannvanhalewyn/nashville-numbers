(function() {

  "use strict";

  var React = require('react')
    , LiveSheetsSearcher = require('./liveSheetsSearcher.jsx')
    , SheetsOverview = require('./sheetsOverview.jsx')

  var SheetManagementModal = React.createClass({
    propTypes: {
      usersSheets: React.PropTypes.array,
      sheets: React.PropTypes.array
    },

    render: function() {
      return (
        <div className="modal-overlay">
          <label htmlFor="sheets-modal-trigger" className="modal-close-trigger"></label>
          <div className="modal-wrap sheets-management-modal">
            <LiveSheetsSearcher sheets={this.props.usersSheets} />
            <SheetsOverview sheets={this.props.sheets} />
          </div>
        </div>
      )
    }
  });

  module.exports = SheetManagementModal;

}())
