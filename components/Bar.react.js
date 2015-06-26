/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('./chord.react');

  Bar = React.createClass({
    render: function() {
      console.log(this.props.chords);
      var chordsComponents = this.props.chords.map(function(chord) {
        return (
          <Chord key={Math.random()} raw={chord} />
        )
      });
      console.log(chordsComponents);
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
