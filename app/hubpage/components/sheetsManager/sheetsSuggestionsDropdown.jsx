(function() {

  "use strict";

  var React           = require('react')
    , SheetSuggestion = require('./sheetSuggestion.jsx')
    , fuzzyMatch      = require('../../../../helpers/fuzzyMatch')

  var SheetSuggestionsDropdown = React.createClass({
    propTypes: {
      sheets: React.PropTypes.array,
      query: React.PropTypes.string
    },

    renderSheetSuggestion: function(sheet) {
      return <SheetSuggestion
              title={sheet.properties.title}
              artist={sheet.properties.artist}
              dbid={sheet._id}
              private={sheet.properties.private}
             />
    },

    matchesQuery: function(sheet) {
      if (this.props.query.length == 0) return false;
      var fullString = sheet.properties.title + sheet.properties.artist;
      return fuzzyMatch(fullString, this.props.query);
    },

    render: function() {
      return (
        <div className="search-dropdown sheet-suggestions">
          <ul>
            {this.props.sheets.filter(this.matchesQuery).map(this.renderSheetSuggestion)}
          </ul>
        </div>
      )
    }
  });

  module.exports = SheetSuggestionsDropdown;

}())
