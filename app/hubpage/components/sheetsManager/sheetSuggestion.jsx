(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')

  var SheetSuggestion = React.createClass({
    propTypes: {
      title: React.PropTypes.string,
      artist: React.PropTypes.string,
      dbid: React.PropTypes.number,
      private: React.PropTypes.bool
    },

    render: function() {
      return (
        <li className="sheet-suggestion">
          <h2 className="title">
            {this.props.title} <small className="artist">{this.props.artist}</small>
          </h2>
          <button className="btn add-button" onClick={this._onClick}>
            <span className="fa fa-plus" /> Add
          </button>
        </li>
      )
    },

    _onClick: function() {
      Actions.addSheetToHub(this.props.dbid);
    }
  });

  module.exports = SheetSuggestion;

}())
