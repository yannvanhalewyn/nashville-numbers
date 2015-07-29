(function() {

  "use strict";

  var React = require('react');
  var classNames = require('classnames');

  var Model = React.createClass({
    getInitialState: function() {
      return {open: false, title: this.props.title, body: this.props.body}
    },

    propTypes: {
      title: React.PropTypes.string,
      body: React.PropTypes.string,
      onConfirm: React.PropTypes.func
    },

    slideOut: function() {
      this.setState({open: true})
    },

    setText: function(params) {
      this.setState({title: params.title, body: params.body});
    },

    setSuccessCallback: function(cb) {
      this.props.onConfirm = cb;
    },

    render: function() {
      var classes = {
        'active': this.state.open
      };
      return (
          <div className={"dropdown-modal " + classNames(classes)}>
            <h1>{this.state.title}</h1>
            <p>{this.state.body}</p>
            <div className="btn btn-red" onClick={this._onCancel}>No!</div>
            <div className="btn" onClick={this._onConfirm}>Yes!</div>
          </div>
      )
    },

    _onCancel: function() {
      this.setState({open: false});
    },

    _onConfirm: function() {
      this.setState({open: false});
      this.props.onConfirm();
    },
  });

  module.exports = Model;

}())
