/** @jsx React.DOM */

(function() {

  var React = require('react');

  var Chord = React.createClass({

    getInitialState: function() {
      return {
        raw: this.props.initialRawChord,
        active: false
      }
    },

    handleInput: function() {
      var newRaw = this.refs.textInput.getDOMNode().value;
      this.setState({raw: newRaw});
    },

    onDoubleClick: function(e) {
      alert("Double Click! " + this.props.raw);
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
      console.log("Rendering chord " + this.state.raw);
      return (
        <input type="text" className={"chord" + (this.state.active ? " active" : "")}
                           onDoubleClick={this.onClick}
                           onChange={this.handleInput}
                           onFocus={this.gainedFocus}
                           onBlur={this.lostFocus}
                           ref="textInput"
                           value={this.state.raw} />
      )
    },

  });

  module.exports = Chord;

}())
