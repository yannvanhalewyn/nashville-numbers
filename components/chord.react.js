/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('../src/chord');

  var ChordComponent = React.createClass({

    getInitialState: function() {
      return {
        chord: this.props.initialChord,
        active: false
      }
    },

    handleInput: function() {
      var newRaw = this.refs.textInput.getDOMNode().value;
      this.state.chord.raw = newRaw;
      this.setState({chord: this.state.chord});
    },

    onDoubleClick: function(e) {
      alert("Double Click! " + this.state.chord.raw);
    },

    gainedFocus: function() {
      console.log("Gained focus");
      this.setState({active: true});
    },

    lostFocus: function() {
      console.log("Lost focus");
      this.setState({active: false});
    },

    render: function() {
      console.log("Rendering chord " + this.state.chord.raw);
      return (
        <input type="text" className={"chord" + (this.state.active ? " active" : "")}
                           onDoubleClick={this.onClick}
                           onChange={this.handleInput}
                           onFocus={this.gainedFocus}
                           onBlur={this.lostFocus}
                           ref="textInput"
                           value={this.state.active ? this.state.chord.raw : this.state.chord.musicNotationString} />
      )
    },

  });

  module.exports = ChordComponent;

}())
