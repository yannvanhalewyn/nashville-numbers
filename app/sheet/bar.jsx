(function() {

  "use strict";

  var React      = require('react')
    , Chord      = require('./chord.jsx')
    , classNames = require('classnames')

  var BarComponent = React.createClass({
    propTypes: {
      chords: React.PropTypes.array
    },

    renderChord: function(chord) {
      return <Chord key={chord.id} raw={chord.raw} />
    },

    render: function() {
      var classes = classNames({
        bar: true,
        "multi-chords": this.props.chords.length > 1
      });
      return (
        <div className={classes}>
          {this.props.chords.map(this.renderChord)}
        </div>
      )
    }
  });

  module.exports = BarComponent;

}())
