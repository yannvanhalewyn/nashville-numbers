/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('./chord.react');
  var ChordModel = require('../chord.js');
  var SheetStore = require('../stores/sheetStore');

  Bar = React.createClass({

    propTypes: {
      chords: React.PropTypes.array
    },

    // Intercept space key
    keyPressed: function(e) {
      // Space
      if(e.keyCode == 32) {
        e.preventDefault();
        this.appendNewChord();
      }
    },

    appendNewChord: function() {
      var newChords = this.state.chords.concat([ new ChordModel() ]);
      this.setState({chords: newChords});
    },

    renderChord: function(chord) {
      return <Chord key={chord.id} initialRaw={chord.raw} />
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
