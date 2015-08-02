(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var Actions = require('../actions/sheetActions');
  var SheetControlEditActions = require('./sheetControlEditActions.jsx');
  var Modal = require('../../utility_react_components/modal.jsx');

  var $ = require('jquery');

  var SheetControlPanel = React.createClass({

    propTypes: {
      dbid: React.PropTypes.string.isRequired
    },

    render: function() {
      return (
        <div className="sheet-control-panel">
          <form action={this._url()} method="post" ref="deleteForm" className="hidden-form">
            <input type="hidden" value="DELETE" name="_method"/>
          </form>
          <Modal
            title="You're about to delete this sheet."
            body="Are you sure? This cannot be undone."
            ref="deleteConfirmationModal"
            onConfirm={this._handleDelete}
          />
          <div className="action-icons">
            <span className="SC-icon fa fa-trash-o" onClick={this._deleteClicked}></span>
            <span className="SC-icon fa fa-star-o" id="SC-fav-icon"></span>
            <SheetControlEditActions />
          </div>
          <div className="btn" id="save-button" onClick={this._handleSave}>Save!</div>
          <span className="fa fa-expand" id="play-mode-toggle"></span>
          <button onClick={this._segnoClicked}>Segno</button>
          <button onClick={this._codaClicked}>Coda</button>
        </div>
      )
    },

    _url: function() {
      return "/sheets/" + this.props.dbid;
    },

    _handleSave: function(e) {
      Actions.saveSheet();
    },

    _deleteClicked: function() {
      this.refs.deleteConfirmationModal.slideOut();
    },

    _handleDelete: function() {
      this.refs.deleteForm.getDOMNode().submit();
    },

    _segnoClicked: function() {
      Actions.toggleSegno();
    },

    _codaClicked: function() {
      Actions.toggleCoda();
    }

  });

  module.exports = SheetControlPanel;

}())
