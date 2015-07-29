(function() {

  "use strict";

  var React = require('react');

  var SheetCard = React.createClass({
    propTypes: {
      title: React.PropTypes.string,
      artist: React.PropTypes.string,
      author: React.PropTypes.object,
      private: React.PropTypes.bool,
      dbid: React.PropTypes.number
    },

    renderPublicOrPrivateIcon: function(isPrivate) {
      if (isPrivate) return <span className="fa fa-key"> Private</span>
      return <span className="fa fa-globe"> Public</span>
    },

    render: function() {
      return (
        <a className="sheet-card" href={"/hubs/" + this.props.hubID + "/sheets/" + this.props.dbid}>
          <li>
            <h2 className="title">
              {this.props.title} <small className="artist">{this.props.artist}</small>
            </h2>
            {this.renderPublicOrPrivateIcon(this.props.private)}
          </li>
        </a>
      )
    }
  });

  module.exports = SheetCard;

}())
