(function() {

  /** @jsx React.DOM */

  var React = require('react')
    , Row = require('./row.jsx')
    , Immutable = require('immutable')
    , Actions = require('../actions/sheetActions')
    , DragableTextArea = require('./dragableTextArea.jsx')

  var Section = React.createClass({
    propTypes: {
      section: React.PropTypes.array,
      name: React.PropTypes.string,
      id: React.PropTypes.string,
      locked: React.PropTypes.bool,
      focusTargetID: React.PropTypes.string,
      currentlyDragging: React.PropTypes.bool
    },

    getInitialState: function() {
      return {name: this.props.name}
    },

    renderRow: function(row) {
      return  (
        <Row
          key={row.id}
          bars={row.bars}
          id={row.id}
          parentIDs={Immutable.Map({ sectionID: this.props.id })}
          locked={this.props.locked}
          focusTargetID={this.props.focusTargetID}
          currentlyDragging={this.props.currentlyDragging}
          dragItem={this.props.dragItem}
        />
      )
    },

    render: function() {
      return (
        <div className="section" >
          <input
            type="text"
            onChange={this._onChange}
            className="section-name"
            value={this.state.name}
            placeholder="Section"
          />
          {this.props.rows.map(this.renderRow)}
          <DragableTextArea />
        </div>
      );
    },

    _onChange: function(e) {
      var text = e.target.value;
      this.setState({name: text});
      Actions.renameSection(this.props.id, text);
    }

  });

  module.exports = Section;

}())
