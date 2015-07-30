(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var SheetControlPanel = require('./sheetControlPanel.jsx');
  var Sheet = require('./sheet.jsx');
  var SheetStore = require('../stores/sheetStore');

  var SheetEditor = React.createClass({

    propTypes: {
      title: React.PropTypes.string,
      artist: React.PropTypes.string,
      dbid: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
      return SheetStore.getState();
    },

    componentDidMount: function() {
      SheetStore.addEventListener(this._onChange)
    },

    compnentWillUnmount: function() {
      SheetStore.removeEventListener(this._onChange);
    },

    render: function() {
      return (
        <div className="sheet-editor">
          <SheetControlPanel dbid={this.props.dbid}/>
          <h1 className="sheet-title">
            {this.state.title} <small className="artist">{this.state.artist}</small>
          </h1>
          <Sheet sections={this.state.sections}/>
        </div>
      )
    },

    _onChange: function() {
      this.setState(SheetStore.getState());
    },

  });

  module.exports = SheetEditor;

}())
