/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('./chord.react');
  var ChordModel = require('../src/chord');

  Bar = React.createClass({
    getInitialState: function() {
      return {chords: this.props.chords}
    },

    render: function() {
      var chordsComponents = this.state.chords.map(function(chord) {
        return (
          <Chord key={Math.random()} initialChord={chord} />
        )
      });
      return (
        <div onKeyDown={this.keyPressed} className="bar">
          <h1>Bar</h1>
          {chordsComponents}
        </div>
      );
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
    }
  });

  module.exports = Bar;

}())
