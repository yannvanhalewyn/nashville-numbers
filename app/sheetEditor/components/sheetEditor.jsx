(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react')
    , SheetControlPanel = require('./sheetControlPanel.jsx')
    , Sheet = require('./sheet.jsx')
    , Title = require('./title.jsx')

  var SheetEditor = React.createClass({

    propTypes: {
      sheetStore: React.PropTypes.object.isRequired,
      dragAndDropStore: React.PropTypes.object,
      dbid: React.PropTypes.number.isRequired
    },

    getInitialState: function() {
      return this.props.sheetStore.getState();
    },

    componentDidMount: function() {
      this.props.sheetStore.on('change', this._update);
    },

    compnentWillUnmount: function() {
      this.props.sheetStore.off('change', this._update)
    },

    render: function() {
      return (
        <div className="sheet-editor">
          <SheetControlPanel dbid={this.props.dbid}/>
          <Title title={this.state.title} artist={this.state.artist} />
          <Sheet
            sections={this.state.sheetData.sections}
            focusTargetID={this.state.focusTargetID}
            dndStore={this.props.dragAndDropStore}
          />
        </div>
      )
    },

    _update: function(params) {
      this.setState(this.props.sheetStore.getState());
      if (params && params.focus) {
        this.setState({focusTargetID: params.focus});
      } else {
        this.setState({focusTargetID: null});
      }
    },

  });

  module.exports = SheetEditor;

}())
