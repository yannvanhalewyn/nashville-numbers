/** @jsx React.DOM */

(function() {

  var React = require('react');

  var Chord = React.createClass({
    render: function() {
      return (
        <p>{this.props.raw}</p>
      )
    }
  });

  module.exports = Chord;

}())
