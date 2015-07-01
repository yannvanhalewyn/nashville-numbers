(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var Sheet = require('./sheet.react');
  var SheetActions = require('../actions/sheetActions');
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
          <button className="btn btn-primary" onClick={this._onAddSection}>Add Sections</button>
          <button className="btn btn-success" onClick={this._onAddRow}>Add Row</button>
          <button className="btn btn-danger" onClick={this._onDeleteBar}>Delete Bar</button>
          <h1 className="sheet-title">
            {this.state.title} <small>{this.state.artist}</small>
          </h1>
          <Sheet sections={this.state.sections}/>
        </div>
      )
    },

    _onChange: function() {
      this.setState(SheetStore.getState());
    },

    _onDeleteBar: function() {
      SheetActions.deleteSelectedBar();
    },

    _onAddSection: function() {
      SheetActions.appendSection();
    },

    _onAddRow: function() {
      SheetActions.appendNewRow();
    }

  });

  module.exports = SheetEditor;

}())
