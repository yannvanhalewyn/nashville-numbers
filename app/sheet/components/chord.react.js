/** @jsx React.DOM */

(function() {

  var React = require('react');
  var Chord = require('../chord');
  var SheetActions = require('../actions/sheetActions');
  var classNames = require('classnames');

  var SPACE_BAR_KEY_CODE = 32;

  var ChordComponent = React.createClass({

    propTypes: {
      rawString: React.PropTypes.string,
      id: React.PropTypes.string.isRequired,
      parentID: React.PropTypes.string.isRequired
    },

    // TODO maybe handle undefined rawstrings (don't want to have to give it an
    // empty one on setup || defaultProps?
    getInitialState: function() {
      return {
        value: this.props.rawString,
        editing: false
      }
    },

    // clearAndFocusInput: function() {
    //   this.setState({userInput: ''}, function() {
    //     React.findDOMNode(this.refs.textInput).focus();
    //   });
    // },
    //
    componentDidMount: function() {
      React.findDOMNode(this.refs.textInput).focus();
    },

    render: function() {
      var classes = {
        'chord': true,
        'chord-editing': this.state.editing,
        'chord-empty': !this.state.value
      };
      return (
        <input type="text" className={classNames(classes)}
                           onDoubleClick={this._onDoubleClick}
                           onChange={this._onChange}
                           onFocus={this._gainedFocus}
                           onBlur={this._lostFocus}
                           onKeyDown={this._onKeyDown}
                           ref="textInput"
                           value={this.state.editing ? this.state.value :
                             this._musicNotationString()} />
      )
    },

    _musicNotationString: function() {
      return new Chord(this.state.value).musicNotationString();
    },

    _onChange: function(e) {
      this.setState({value: e.target.value});
    },

    _onKeyDown: function(e) {
      if(e.keyCode === SPACE_BAR_KEY_CODE) {
        e.preventDefault();
        SheetActions.appendNewChord(this.props.id, this.props.parentID);
      }
    },

    _onDoubleClick: function(e) {
      alert("Double Click! " + this.state.value);
    },

    _gainedFocus: function() {
      this.setState({editing: true});
    },

    _lostFocus: function() {
      SheetActions.updateChordText(this.props.id, this.state.value);
      this.setState({editing: false});
    },


  });

  module.exports = ChordComponent;

}())
