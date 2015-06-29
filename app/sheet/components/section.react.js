(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Row = require('./row.react')
  var SheetStore = require('../stores/sheetStore');

  var Section = React.createClass({

    propTypes: {
      rows: React.PropTypes.array,
      name: React.PropTypes.string
    },

    renderRow: function(row) {
      return <Row key={row.id} bars={row.bars.map(SheetStore.getBar)} />
    },

    render: function() {
      return (
        <div className="section">
          <h2 className="section-name">{this.props.name}</h2>
          {this.props.rows.map(this.renderRow)}
        </div>
      );
    }
  });

  module.exports = Section;

}())
