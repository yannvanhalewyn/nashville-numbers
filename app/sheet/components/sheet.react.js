(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Section = require('./section.react')
  var SheetActions = require('../actions/sheetActions');
  var SheetStore = require('../stores/sheetStore');

  Sheet = React.createClass({

    propTypes: {
      sheet: React.PropTypes.object.isRequired
    },

    componentDidMount: function() {
      SheetStore.addEventListener(this._onChange)
    },

    compnentWillUnmount: function() {
      SheetStore.removeEventListener(this._onChange);
    },

    renderSection: function(sectionID) {
      var section = SheetStore.getSection(sectionID);
      return <Section key={section.id} rows={section.rows.map(SheetStore.getRow)} name={section.name} id={section.id} />
    },

    render: function() {
      var sheet = this.props.sheet;
      return (
        <div className="sheet">
          <h1 className="sheet-title">
            {sheet.title} <small>{sheet.artist}</small>
          </h1>
          {sheet.sections.map(this.renderSection)}
        </div>
      )
    },

    _onChange: function() {
      console.log("on change in SHEET !!!");
    },

  });

  module.exports = Sheet;

}())
