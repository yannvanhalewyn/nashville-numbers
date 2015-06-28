/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('../src/chord');
  var classNames = require('classnames');

  var ChordComponent = React.createClass({

    propTypes: {
      initialChord: React.PropTypes.object
    },

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
      this.setState({active: true});
    },

    lostFocus: function() {
      this.setState({active: false});
    },

    render: function() {
      var classes = {
        'chord': true,
        'chord-active': this.state.active
      };
      return (
        <input type="text" className={classNames(classes)}
                           onDoubleClick={this.onClick}
                           onChange={this.handleInput}
                           onFocus={this.gainedFocus}
                           onBlur={this.lostFocus}
                           ref="textInput"
                           value={this.state.active ? this.state.chord.raw :
                             this.state.chord.musicNotationString()} />
      )
    },

  });

  module.exports = ChordComponent;

}())
