(function() {

  "use strict";

  var React = require('react')
    , Row = require('./row.jsx')

  var SectionComponent = React.createClass({
    propTypes: {
      name: React.PropTypes.string,
      rows: React.PropTypes.array
    },

    renderRow: function(row) {
      return <Row key={row.id} bars={row.bars} />
    },

    render: function() {
      return (
        <div className="section">
          <h2 className="section-name">{this.props.name}</h2>
          {this.props.rows.map(this.renderRow)}
        </div>
      )
    }
  });

  module.exports = SectionComponent;

}())
