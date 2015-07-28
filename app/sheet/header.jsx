(function() {

  "use strict";

  var React = require('react');

  var SheetHeaderComponent = React.createClass({
    propTypes: {
      title: React.PropTypes.string,
      artist: React.PropTypes.string
    },

    render: function() {
      return (
        <div className="sheet-header">
          <h1 className="sheet-title">
            {this.props.title} <small className="artist">{this.props.artist}</small>
          </h1>
        </div>
      )
    }
  });

  module.exports = SheetHeaderComponent;

}())
