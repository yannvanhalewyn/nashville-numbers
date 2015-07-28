(function() {

  "use strict";

  var React = require('react')
    , Chord = require('./chord.jsx')

  var BarComponent = React.createClass({
    propTypes: {
      chords: React.PropTypes.array
    },

    renderChord: function(chord) {
      return <Chord key={chord.id} raw={chord.raw} />
    },

    render: function() {
      return (
        <div className="bar">
          {this.props.chords.map(this.renderChord)}
        </div>
      )
    }
  });

  module.exports = BarComponent;

}())
