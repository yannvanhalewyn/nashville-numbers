(function() {

  "use strict";
  /** @jsx React.DOM */

  var React = require('react');
  var NetworkActions = require('../actions/networkActions');
  var SheetControlEditActions = require('./sheetControlEditActions.react');
  var Modal = require('../../utility_react_components/modal.react');

  var $ = require('jquery');

  var SheetControlPanel = React.createClass({


    render: function() {
      return (
        <div className="sheet-control-panel">
          <form action="/sheets/559c285fbdc11328483e09ae" method="post" ref="deleteForm">
            <input type="hidden" value="DELETE" name="_method"/>
          </form>
          <Modal
            title="You're about to delete this sheet."
            body="Are you sure? This cannot be undone."
            ref="deleteConfirmationModal"
            onConfirm={this._handleDelete}
          />
          <span className="SC-icon fa fa-trash-o" onClick={this._deleteClicked}></span>

          <span className="SC-icon fa fa-star-o" id="SC-fav-icon"></span>
          <SheetControlEditActions />
          <span className="fa fa-expand" id="play-mode-toggle"></span>
          <div className="btn" id="save-button" onClick={this._handleSave}>Save!</div>
        </div>
      )
    },

    _handleSave: function(e) {
      NetworkActions.save();
    },

    _deleteClicked: function() {
      this.refs.deleteConfirmationModal.slideOut();
    },

    _handleDelete: function() {
      this.refs.deleteForm.getDOMNode().submit();
    }

  });

  module.exports = SheetControlPanel;

}())
