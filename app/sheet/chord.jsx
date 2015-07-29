(function() {

  "use strict";

  var React = require('react')
    , Chord = require('../sheetEditor/chord')

  var ChordComponent = React.createClass({
    propTypes: {
      raw: React.PropTypes.string
    },

    render: function() {
      return <span className="chord">{this.getMusicNotationString()}</span>;
    },

    getMusicNotationString: function() {
      return new Chord(this.props.raw).musicNotationString();
    }
  });

  module.exports = ChordComponent;

}())
