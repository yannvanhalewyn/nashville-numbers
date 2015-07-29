(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../../actions/hubpageActions')

  var SheetCard = React.createClass({
    propTypes: {
      title: React.PropTypes.string,
      artist: React.PropTypes.string,
      author: React.PropTypes.object,
      _id: React.PropTypes.string
    },

    render: function() {
      return (
        <li>
          <h2 className="title">
            {this.props.title} <small className="artist">{this.props.artist}</small>
          </h2>
          <button onClick={this._onClick} className="btn btn-red remove-button">
            <span className="fa fa-times" /> Remove
          </button>
        </li>
      )
    },

    _onClick: function() {
      Actions.removeSheetFromHub(this.props._id);
    }
  });

  module.exports = SheetCard;

}())
