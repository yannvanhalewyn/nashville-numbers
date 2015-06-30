/** @jsx React.DOM */

var React = require('react');
var SheetEditor = require('./sheet/components/sheetEditor.react');
var SheetStore = require('./sheet/stores/sheetStore');

data = JSON.parse(document.getElementById('initial-state').innerHTML);
SheetStore.setInitialData(data);

React.render(
  <SheetEditor />,
  document.getElementById('sheet-container')
);

