(function() {

  /** @jsx React.DOM */

  var React = require('react');
  var Section = require('./section.react')
  var SheetActions = require('../actions/sheetActions');
  var SheetStore = require('../stores/sheetStore');

  Sheet = React.createClass({

    propTypes: {
      initialTitle: React.PropTypes.string,
      initialArtist: React.PropTypes.string,
      initialSections: React.PropTypes.array
    },

    getInitialState: function() {
      return {
        sections: this.props.initialSections,
        title: this.props.initialTitle,
        artist: this.props.initialArtist
      }
    },

    componentDidMount: function() {
      SheetStore.addEventListener(this._onChange)
    },

    renderSection: function(section) {
      return <Section key={section.id} initialRows={section.rows} initialName={section.name} />
    },

    render: function() {
      return (
        <div onClick={this._handleClick}>
          <h1>kaka</h1>
          <p>popo</p>
        </div>
      )
      // return (
      //   <div className="sheet">
      //     <h1 className="sheet-title">
      //       {this.state.title} <small>{this.state.artist}</small>
      //     </h1>
      //     {this.state.sections.map(this.renderSection)}
      //   </div>
      // )
    },

    _onChange: function() {
      console.log("on change in SHEET !!!");
    },

    _handleClick: function() {
      SheetActions.updateChordText(1, "kaka");
    }

  });

  module.exports = Sheet;

}())
