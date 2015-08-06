(function() {

  "use strict";

  var React = require('react')
    , Actions = require('../actions/sheetActions')

  var TitleComponent = React.createClass({
    propTypes: {
      title: React.PropTypes.string,
      artist: React.PropTypes.string
    },

    getInitialState: function() {
      return {title: this.props.title, artist: this.props.artist};
    },

    render: function() {
      return (
        <div className="sheet-title">
          <input
            type="text"
            value={this.state.title}
            onChange={this._titleChanged}
            className="title"
            placeholder="Title"
          />
          <input
            type="text"
            value={this.state.artist}
            onChange={this._artistChanged}
            className="artist"
            placeholder="Artist"
          />
        </div>
      )
    },

    _titleChanged: function(e) {
      var text = e.target.value;
      this.setState({title: text});
      Actions.setTitle(text);
    },

    _artistChanged: function(e) {
      var text = e.target.value;
      this.setState({artist: text});
      Actions.setArtist(text);
    }
  });

  module.exports = TitleComponent;

}())
