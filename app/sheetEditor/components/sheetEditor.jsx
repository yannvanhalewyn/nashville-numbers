(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var SheetControlPanel = require('./sheetControlPanel.jsx');
  var Sheet = require('./sheet.jsx');

  var SheetEditor = React.createClass({

    propTypes: {
      store: React.PropTypes.object.isRequired,
      dbid: React.PropTypes.number.isRequired
    },

    getInitialState: function() {
      return this.props.store.getState();
    },

    componentDidMount: function() {
      this.props.store.on('change', this._update);
    },

    compnentWillUnmount: function() {
      this.props.store.off('change', this._update)
    },

    render: function() {
      return (
        <div className="sheet-editor">
          <SheetControlPanel dbid={this.props.dbid}/>
          <h1 className="sheet-title">
            {this.state.title} <small className="artist">{this.state.artist}</small>
          </h1>
          <Sheet sections={this.state.sheetData.sections} focusTargetID={this.state.focusTargetID}/>
        </div>
      )
    },

    _update: function(params) {
      this.setState(this.props.store.getState());
      if (params && params.focus) {
        this.setState({focusTargetID: params.focus});
      } else {
        this.setState({focusTargetID: null});
      }
    },

  });

  module.exports = SheetEditor;

}())
