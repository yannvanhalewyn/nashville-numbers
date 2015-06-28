/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('./chord.react');

  Bar = React.createClass({

    propTypes: {
      initialChords: React.PropTypes.array
    },

    getInitialState: function() {
      return {
        chords: this.props.initialChords
      }
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
      return <Chord key={Math.floor(Math.random() * 300)} initialChord={chord} />
    },

    render: function() {
      return (
        <div onKeyDown={this.keyPressed} className="bar">
          {this.state.chords.map(this.renderChord)}
        </div>
      );
    },

  });

  module.exports = Bar;

}())
