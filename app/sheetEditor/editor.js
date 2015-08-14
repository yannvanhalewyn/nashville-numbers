/** @jsx React.DOM */

var React = require('react')
  , SheetEditor = require('./components/sheetEditor.jsx')
  , SheetStore = require('./stores/sheetStore')
  , DragAndDropStore = require('./stores/dragAndDropStore')

var sheetStore;
try {
  var data = JSON.parse(document.getElementById('initial-state').innerHTML);
  sheetStore = new SheetStore(data);
} catch(e) {
  console.log("error on parse", e);
}

var dragAndDropStore = new DragAndDropStore();

React.render(
  <SheetEditor sheetStore={sheetStore} dragAndDropStore={dragAndDropStore} dbid={data._id}/>,
  document.getElementById('sheet-container')
);

