(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')
    , SheetsSuggestionsDropdown = require('./sheetsSuggestionsDropdown.jsx')


  var LiveSheetsSearcher = React.createClass({
    propTypes: {
      sheets: React.PropTypes.array
    },

    getInitialState: function() {
      return {searchVal: ""};
    },

    render: function() {
      return (
        <div className="live-sheets-searcher">
          <div className="search-field">
            <span className="fa fa-search"></span>
            <input type="text" onChange={this._onChange} onFocus={this._onFocus} />
          </div>
          <SheetsSuggestionsDropdown query={this.state.searchVal} sheets={this.props.sheets} />
        </div>
      )
    },

    _onChange: function(e) {
      this.setState({searchVal: e.target.value})
    },

    _onFocus: function() {
      Actions.fetchUsersSheets();
    }
  });

  module.exports = LiveSheetsSearcher;

}())
