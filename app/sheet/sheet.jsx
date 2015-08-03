(function() {

  "use strict";

  var React = require('react')
    , Header = require('./header.jsx')
    , Section = require('../sheetEditor/components/section.jsx')

  var Sheet = React.createClass({
    propTypes: {
      sheetData: React.PropTypes.object
    },

    renderSection: function(section) {
      return <Section key={section.id} name={section.name} rows={section.rows} locked={true} />
    },

    render: function() {
      return (
        <div>
          <Header
            title={this.props.title}
            artist={this.props.artist}
          />
          {this.props.sheetData.sections ? this.props.sheetData.sections.map(this.renderSection) : "No content"}
        </div>
      )
    }
  });

  module.exports = Sheet;

}())
