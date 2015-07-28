(function() {

  "use strict";

  var React = require('react');

  var SheetSuggestion = React.createClass({
    propTypes: {
      title: React.PropTypes.string,
      artist: React.PropTypes.string,
      dbid: React.PropTypes.number,
      private: React.PropTypes.bool
    },

    render: function() {
      return (
        <div>
          <h2>{this.props.title} <small>{this.props.artist}</small> </h2>
          <button className="btn" onClick={this._onClick}><span className="fa fa-plus" /> Add</button>
        </div>
      )
    },

    _onClick: function() {
      console.log("CLICK", this.props.dbid);
    }
  });

  module.exports = SheetSuggestion;

}())
