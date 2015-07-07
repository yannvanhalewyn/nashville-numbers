(function() {

  "use strict";

  var React = require('react');
  var classNames = require('classnames');

  var Model = React.createClass({
    getInitialState: function() {
      return {open: false}
    },

    propTypes: {
      title: React.PropTypes.String,
      body: React.PropTypes.String,
      onConfirm: React.PropTypes.func
    },

    slideOut: function() {
      this.setState({open: true})
    },

    render: function() {
      var classes = {
        'modal-active': this.state.open
      };
      return (
        <div className="outer-modal grid">
          <div className={"modal skip-1-3 col-1-3 " + classNames(classes)}>
            <h1>{this.props.title}</h1>
            <p>{this.props.body}</p>
            <div className="btn btn-red" onClick={this._onCancel}>No!</div>
            <div className="btn" onClick={this._onConfirm}>OK!</div>
          </div>
        </div>
      )
    },

    _onCancel: function() {
      this.setState({open: false});
    },

    _onConfirm: function() {
      this.setState({open: false});
      this.props.onConfirm();
    }

  });

  module.exports = Model;

}())
