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
      console.log(this.state);
      return (
        <div className="sheet-editor">
          <button className="btn btn-primary">Add Sections</button>
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
    }

  });

  module.exports = SheetEditor;

}())
