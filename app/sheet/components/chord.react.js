/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('../chord');
  var SheetActions = require('../actions/sheetActions');
  var classNames = require('classnames');

  var ChordComponent = React.createClass({

    propTypes: {
      rawString: React.PropTypes.string,
      id: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
      return {
        value: this.props.rawString,
        active: false
      }
    },

    // clearAndFocusInput: function() {
    //   this.setState({userInput: ''}, function() {
    //     React.findDOMNode(this.refs.textInput).focus();
    //   });
    // },
    //
    // componentDidMount: function() {
    //   React.findDOMNode(this.refs.textInput).focus();
    // },

    render: function() {
      var classes = {
        'chord': true,
        'chord-active': this.state.active
      };
      return (
        <input type="text" className={classNames(classes)}
                           onDoubleClick={this._onDoubleClick}
                           onChange={this._onChange}
                           onFocus={this._gainedFocus}
                           onBlur={this._lostFocus}
                           ref="textInput"
                           value={this.state.active ? this.state.value :
                             this._musicNotationString()} />
      )
    },

    _musicNotationString: function() {
      return new Chord(this.state.value).musicNotationString();
    },

    _onChange: function(e) {
      this.setState({value: e.target.value});
    },

    _onDoubleClick: function(e) {
      alert("Double Click! " + this.state.value);
    },

    _gainedFocus: function() {
      this.setState({active: true});
    },

    _lostFocus: function() {
      SheetActions.updateChordText(this.props.id, this.state.value);
      this.setState({active: false});
    },


  });

  module.exports = ChordComponent;

}())
