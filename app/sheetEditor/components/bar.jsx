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

  var REPEAT_LEFT_HTML = "<use xlink:href='#repetition-left' />";
  var REPEAT_RIGHT_HTML = "<use xlink:href='#repetition-right' />";

  var Bar = React.createClass({

    propTypes: {
      chords: React.PropTypes.array,
      id: React.PropTypes.string.isRequired,
      parentIDs: React.PropTypes.object.isRequired
    },

    renderChord: function(chord) {
      return (
        <Chord
          key={chord.id}
          rawString={chord.raw}
          id={chord.id}
          parentIDs={this.props.parentIDs.set('barID', this.props.id)}
        />
      )
    },

    renderRepeatLeft: function() {
      return <div className="repeat-left">
        <svg viewbox="0 0 100 100" dangerouslySetInnerHTML={{__html: REPEAT_LEFT_HTML}} />
      </div>
    },

    renderRepeatRight: function() {
      return <div className="repeat-right">
        <svg viewbox="0 0 100 100" dangerouslySetInnerHTML={{__html: REPEAT_RIGHT_HTML}} />
      </div>
    },

    render: function() {
      var classes = classNames({
        bar: true,
        "multi-chords": this.props.chords.length > 1
      });
      return (
          <span className={classes}>
            {this.props.repeatLeft ? this.renderRepeatLeft() : null}
            <div className="chords">
              {this.props.chords.map(this.renderChord)}
            </div>
            {this.props.repeatRight ? this.renderRepeatRight() : null}
          </span>
      );
    }

  });

  module.exports = Bar;

}())
