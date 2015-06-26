/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('./chord.react');

  Bar = React.createClass({
    render: function() {
      var chordsComponents = this.props.chords.map(function(chord) {
        return (
          <Chord key={Math.random()} initialChord={chord} />
        )
      });
      return (
        <div className="bar">
          <h1>Bar</h1>
          {chordsComponents}
        </div>
      );
    }
  });

  module.exports = Bar;

}())
