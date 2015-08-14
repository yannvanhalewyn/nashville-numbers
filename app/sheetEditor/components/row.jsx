(function() {

  var React = require('react')
    , Bar = require('./bar.jsx')
    , DropZone = require('./dropZone.jsx')

  var Row = React.createClass({

    propTypes: {
      bars: React.PropTypes.array,
      id: React.PropTypes.string.isRequired,
      parentIDs: React.PropTypes.object.isRequired,
      focusTargetID: React.PropTypes.string,
      currentlyDragging: React.PropTypes.bool
    },

    getInitialState: function() {
      return {bars: this.props.initialBars}
    },

    renderSymbolsRow: function(bar) {
      return (
        <div key={bar.id + "s"} className="symbol-container">
          {bar.segno ? <span className="segno">@</span> : null }
          {bar.coda ? <span className="coda">Ø</span> : null }
        </div>
      )
    },

    renderBar: function(bar) {
      return (
        <Bar
          key={bar.id}
          chords={bar.chords}
          id={bar.id}
          parentIDs={this.props.parentIDs.set('rowID', this.props.id)}
          repeatLeft={bar.repeatLeft}
          repeatRight={bar.repeatRight}
          locked={this.props.locked}
          focusTargetID={this.props.focusTargetID}
        />
      )
    },

    renderDropZonesAbove: function(bar) {
      var dropZones = this.props.bars.map(function(bar) {
        return <DropZone target={{barID: bar.id, position: "above"}}/>
      });
      return <div className="dropzones"> {dropZones} </div>
    },

    renderDropZonesBelow: function(bar) {
      var dropZones = this.props.bars.map(function(bar) {
        return <DropZone target={{barID: bar.id, position: "below"}}/>
      });
      return <div className="dropzones"> {dropZones} </div>
    },

    render: function() {
      return (
        <div className="row" onMouseEnter={this._onMouseOver} onMouseLeave={this._onMouseLeave}>
          <div className="symbols">
            {this.props.bars.map(this.renderSymbolsRow)}
          </div>
          {this._shouldDropZonesDisplay() ? this.renderDropZonesAbove() : null}
          <div className="bars">
            {this.props.bars.map(this.renderBar)}
          </div>
          {this._shouldDropZonesDisplay() ? this.renderDropZonesBelow() : null}
        </div>
      );
    },

    _onMouseOver: function() {
      // Little optmisation, don't bother updating state if not dragging
      if (!this.state.hover && this.props.currentlyDragging)
        this.setState({hover: true})
    },

    _onMouseLeave: function() {
      if (this.state.hover)
        this.setState({hover: false})
    },

    _shouldDropZonesDisplay: function() {
      return this.props.currentlyDragging && this.state.hover;
    }

  });

  module.exports = Row;

}())
