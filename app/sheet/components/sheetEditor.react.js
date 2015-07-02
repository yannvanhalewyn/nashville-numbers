(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var SheetControlPanel = require('./sheetControlPanel.react');
  var Sheet = require('./sheet.react');
  var SheetStore = require('../stores/sheetStore');

  var SheetEditor = React.createClass({

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
          <SheetControlPanel />
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
