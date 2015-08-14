(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../actions/dragAndDropActions').actions;

  var DropZone = React.createClass({
    render: function() {
      return <span
        style={this._style()}
        onMouseOver={this._onMouseOver}
        onMouseLeave={this._onMouseLeave}
        onMouseUp={this._onMouseUp}
        className="dropzone"
        > DROP
        </span>
    },

    _onMouseOver: function() {
      this.setState({hover: true});
      Actions.storeDropCandidate(this.props.target);
    },

    _onMouseLeave: function() {
      this.setState({hover: false});
    },

    _style: function() {
      if (this.state && this.state.hover) {
        return {background: "orange", "border": "none"}
      }
    }
  });

  module.exports = DropZone;

}())
