/** @jsx React.DOM */

var React = require('react');
var SheetEditor = require('./components/sheetEditor.react');
var SheetStore = require('./stores/sheetStore');

try {
  var data = JSON.parse(document.getElementById('initial-state').innerHTML);
  SheetStore.setInitialData(data);
} catch(e) {
  SheetStore.setDefaultData();
}

React.render(
  <SheetEditor />,
  document.getElementById('sheet-container')
);

