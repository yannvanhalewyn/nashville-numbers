/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('./chord.react');
  var ChordModel = require('../chord.js');

  Bar = React.createClass({

    propTypes: {
      chords: React.PropTypes.array,
      id: React.PropTypes.string.isRequired
    },

    appendNewChord: function() {
      var newChords = this.state.chords.concat([ new ChordModel() ]);
      this.setState({chords: newChords});
    },

    renderChord: function(chord) {
      return <Chord
                key={chord.id}
                rawString={chord.raw}
                id={chord.id}
                barID={this.props.id}
                />
    },

    render: function() {
      return (
        <div onKeyDown={this.keyPressed} className="bar">
          {this.props.chords.map(this.renderChord)}
        </div>
      );
    },

  });

  module.exports = Bar;

}())
