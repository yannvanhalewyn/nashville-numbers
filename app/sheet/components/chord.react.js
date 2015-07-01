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
      parentIDs: React.PropTypes.object.isRequired
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
      this.getDOMNode().focus();
    },

    render: function() {
      var classes = {
        'chord': true,
        'chord-editing': this.state.editing,
        'chord-empty': !this.state.value
      };
      return (
        <input type="text" className={classNames(classes)}
          className={classNames(classes)}
          onChange={this._onChange}
          onFocus={this._gainedFocus}
          onBlur={this._lostFocus}
          onKeyDown={this._onKeyDown}
          value={this.state.editing ? this.state.value :
            this._musicNotationString()}
        />
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
        SheetActions.appendNewChord(this.props.id, this.props.parentIDs.get('barID'));
      }
    },

    _onDoubleClick: function(e) {
      alert("Double Click! " + this.state.value);
    },

    _gainedFocus: function() {
      SheetActions.storeChordRefAsSelected(this.props.id, this.props.parentIDs.toJS());
      this.setState({editing: true});
    },

    _lostFocus: function() {
      SheetActions.updateChordText(this.props.id, this.state.value);
      this.setState({editing: false});
    },


  });

  module.exports = ChordComponent;

}())
