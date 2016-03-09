(function() {

  "use strict";
  /** @jsx React.DOM */

  var RETURN_KEYCODE = 13;
  var TAB_KEYCODE = 9

  var React = require('react')
    , Chord = require('./chord.jsx')
    , ChordModel = require('../chord.js')
    , SheetActions = require('../actions/sheetActions')
    , classNames = require('classnames')
    , Dropable = require('../../utility_react_components/dropable.jsx')
    , dndActions = require('../actions/dragAndDropActions').actions;

  var REPEAT_LEFT_HTML = "<use xlink:href='#repetition-left' />";
  var REPEAT_RIGHT_HTML = "<use xlink:href='#repetition-right' />";

  var Bar = React.createClass({

    propTypes: {
      chords: React.PropTypes.array,
      id: React.PropTypes.string,
      parentIDs: React.PropTypes.object,
      repeatLeft: React.PropTypes.bool,
      repeatRight: React.PropTypes.bool,
      locked: React.PropTypes.bool,
      focusTargetID: React.PropTypes.string,
      dragItem: React.PropTypes.object
    },

    renderChord: function(chord) {
      return (
        <Chord
          key={chord.id}
          rawString={chord.raw}
          id={chord.id}
          parentIDs={this.props.parentIDs.set('barID', this.props.id)}
          locked={this.props.locked}
          autoFocus={chord.id === this.props.focusTargetID}
        />
      )
    },

    renderRepeatLeft: function() {
      return <div className="repeat-left">
        <svg dangerouslySetInnerHTML={{__html: REPEAT_LEFT_HTML}} />
      </div>
    },

    renderRepeatRight: function() {
      return <div className="repeat-right">
        <svg dangerouslySetInnerHTML={{__html: REPEAT_RIGHT_HTML}} />
      </div>
    },

    render: function() {
      var classes = classNames({
        bar: true,
        "multi-chords": this.props.chords.length > 1
      });

      var style = {
        "margin-top": this.state && this.state.gutterTop ? "40px" : "0",
        "margin-bottom": this.state && this.state.gutterBottom ? "40px" : "0",
      }

      return (
          <span style={style} onMouseMove={this._onMouseOver} onMouseLeave={this._onMouseLeave} className={classes}>
            {this.props.repeatLeft ? this.renderRepeatLeft() : null}
            <div className="chords">
              {this.props.chords.map(this.renderChord)}
            </div>
            {this.props.repeatRight ? this.renderRepeatRight() : null}
          </span>
      );
    },

    _onMouseOver: function() {
      if (this.props.dragItem) {
        var dragItemRect = this.props.dragItem.getBoundingClientRect();
        var barRect = this._getCachedDomNode().getBoundingClientRect();
        if (dragItemRect.top < barRect.top) {
          console.log("Setting gutter top");
          this.setState({gutterTop: true, gutterBottom: false})
        } else {
          console.log("Setting gutter bottom");
          this.setState({gutterBottom: true, gutterTop: false})
        }
      }
    },

    _onMouseLeave: function() {
      console.log("Mouse leave");
      if (this.state && (this.state.gutterTop || this.state.gutterBottom)) {
        this.setState({gutterBottom: false, gutterTop: false})
      }
    },

    _getCachedDomNode: function() {
      if (this.domNode) return this.domNode;
      this.domNode = this.getDOMNode();
      return this.domNode;
    }

  });

  module.exports = Bar;

}())
