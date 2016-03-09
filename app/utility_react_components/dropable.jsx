(function() {

  "use strict";

  var React = require('react')

  var Dropable = React.createClass({
    propTypes: {
      onActivate: React.PropTypes.function,
      onLeave: React.PropTypes.function
    },

    render: function() {
      return (
        <span
        style={this._style()}
        onMouseOver={this._onMouseOver}
        onMouseLeave={this._onMouseLeave}
        onMouseUp={this._onMouseUp}
        className={"dropzone " + this.props.className} >
          {this.props.children}
        </span>
      )
    },

    _onMouseOver: function() {
      this.setState({hover: true});
      if (typeof this.props.onActivate === "function") this.props.onActivate();
      Actions.storeDropCandidate(this.props.target);
    },

    _onMouseLeave: function() {
      this.setState({hover: false});
      if (typeof this.props.onLeave === "function") this.props.onLeave();
    },

    _style: function() {
      if (this.state && this.state.hover) {
        return {background: "rgba(100, 100, 0, .5)", "border": "none"}
      }
    }
  });

  module.exports = Dropable;

}())
