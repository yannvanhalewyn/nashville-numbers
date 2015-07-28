(function() {

  "use strict";

  var React = require('react');

  var ChordComponent = React.createClass({
    propTypes: {
      raw: React.PropTypes.string
    },

    render: function() {
      return <span className="chord">{this.props.raw}</span>;
    }
  });

  module.exports = ChordComponent;

}())
