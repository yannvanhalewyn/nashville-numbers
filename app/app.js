/** @jsx React.DOM */

var React = require('react');
var Sheet = require('./sheet/components/sheet.react');
var SheetStore = require('./sheet/stores/sheetStore');

data = JSON.parse(document.getElementById('initial-state').innerHTML);
SheetStore.setInitialData(data);

React.render(
  <Sheet />,
  document.getElementById('sheet-container')
);

