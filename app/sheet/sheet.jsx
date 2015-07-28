(function() {

  "use strict";

  var React = require('react')
    , Header = require('./header.jsx')
    , Section = require('./section.jsx')

  var Sheet = React.createClass({
    propTypes: {
      sheetData: React.PropTypes.object
    },

    renderSection: function(section) {
      return <Section key={section.id} name={section.name} rows={section.rows} />
    },

    render: function() {
      return (
        <div>
          <Header
            title={this.props.sheetData.title}
            artist={this.props.sheetData.artist}
          />
          {this.props.sheetData.sections.map(this.renderSection)}
        </div>
      )
    }
  });

  module.exports = Sheet;

}())
