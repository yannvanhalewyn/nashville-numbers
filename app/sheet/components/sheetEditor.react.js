(function() {

  "use strict";
  /** @jsx React.DOM */

  var SheetControlPanel = require('./sheetControlPanel.react');
  var Sheet = require('./sheet.react');
  var React = require('react');
  console.log(SheetControlPanel);
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
          <SheetControlPanel />
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
