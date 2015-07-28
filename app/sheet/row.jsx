(function() {

  "use strict";

  var React = require('react')
    , Bar = require('./bar.jsx');


  var RowComponent = React.createClass({
    propTypes: {
      bars: React.PropTypes.array
    },

    renderBar: function(bar) {
      return <Bar key={bar.id} chords={bar.chords} />
    },

    render: function() {
      return (
        <div className="row">
          {this.props.bars.map(this.renderBar)}
        </div>
      )
    }
  });

  module.exports = RowComponent;

}())
