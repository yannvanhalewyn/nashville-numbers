(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Section = require('./section.react')
  var SheetActions = require('../actions/sheetActions');
  var SheetStore = require('../stores/sheetStore');

  Sheet = React.createClass({

    getInitialState: function() {
      return SheetStore.getEntireState();
    },

    componentDidMount: function() {
      SheetStore.addEventListener(this._onChange)
    },

    compnentWillUnmount: function() {
      SheetStore.removeEventListener(this._onChange);
    },

    renderSection: function(section) {
      return <Section key={section.id} rows={section.rows} name={section.name} id={section.id} />
    },

    render: function() {
      return (
        <div className="sheet">
          <h1 className="sheet-title">
            {this.state.title} <small>{this.state.artist}</small>
          </h1>
          {this.state.sections.map(this.renderSection)}
        </div>
      )
    },

    _onChange: function() {
      console.log("on change in SHEET !!!");
    },

  });

  module.exports = Sheet;

}())
