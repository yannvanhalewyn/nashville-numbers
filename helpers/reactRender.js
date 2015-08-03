(function() {

  "use strict";

  require('node-jsx').install({extension: '.jsx'})
  var include = require('include')
    , React = require('react')
    , Sheet = React.createFactory(include('/app/sheet/sheet.jsx'))
    , denormalize = include('/app/helpers/deNormalize')

  var ReactRender = {
    sheet: function(targetSheet) {
      var data = JSON.parse(targetSheet.properties.data);
      var reactElement = Sheet({
        sheetData: denormalize(data),
        title: targetSheet.properties.title,
        artist: targetSheet.properties.artist
      });
      return React.renderToString(reactElement);
    }
  }

  module.exports = ReactRender;

}())
