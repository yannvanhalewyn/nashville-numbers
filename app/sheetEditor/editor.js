/** @jsx React.DOM */

var React = require('react');
var SheetEditor = require('./components/sheetEditor.jsx');
var SheetStore = require('./stores/sheetStore');

var data;
try {
  data = JSON.parse(document.getElementById('initial-state').innerHTML);
  SheetStore.setInitialData(data);
} catch(e) {
  SheetStore.setDefaultData();
}

React.render(
  <SheetEditor dbid={data._id}/>,
  document.getElementById('sheet-container')
);

