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

try {
  var dbid = document.getElementById('dbid').value;
  SheetStore.setDBID(dbid);
} catch(e) {
  console.log("ERROR");
  console.log(e);
}

React.render(
  <SheetEditor dbid={dbid}/>,
  document.getElementById('sheet-container')
);

