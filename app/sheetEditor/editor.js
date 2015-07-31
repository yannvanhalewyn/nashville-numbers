/** @jsx React.DOM */

var React = require('react');
var SheetEditor = require('./components/sheetEditor.jsx');
var SheetStore = require('./stores/sheetStore');

var store;
try {
  var data = JSON.parse(document.getElementById('initial-state').innerHTML);
  store = new SheetStore(data);
} catch(e) {
  console.log("error on parse", e);
}

React.render(
  <SheetEditor store={store} dbid={data._id}/>,
  document.getElementById('sheet-container')
);

