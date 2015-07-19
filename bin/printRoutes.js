(function() {

  var Express = require('express')
    , app     = Express()
    , _       = require('lodash')
    , Table   = require('cli-table')
    , include = require('include')

  module.exports = function(routesFile) {

    // Store all the calls to app.use
    var APP_USED = []

    // Replace the `use` function to store the routers and the urls they operate on
    app.use = function() {
      var urlBase = arguments[0];

      // Find the router in the args list
      _.forEach(arguments, function(arg) {
        if (arg.name == 'router') {
          APP_USED.push({
            urlBase: urlBase,
            router: arg
          });
        }
      });
    };

    // Let the routes function run with the stubbed app object.
    include(routesFile)(app);

    // Print out the static routes
    var staticTable = new Table({head: ['', 'STATIC ROUTES']});
    app._router.stack.forEach(function(r) {
      if (r.route && r.route.path) {
        var method = r.route.stack[0].method;
        var path = r.route.path;
        staticTable.push([method ? method.toUpperCase() : "?", path]);
      }
    });
    console.log(staticTable.toString());

    // GRAB all the routes from our saved routers:
    _.each(APP_USED, function(used) {
      var tableName = _.capitalize(_.last(used.urlBase.split('/')));
      var table = new Table({
        head: ['', '=> ' + tableName]
      });

      // On each route of the router
      _.each(used.router.stack, function(stack) {
        if (stack.route) {
          var path = stack.route.path;
          var method = stack.route.stack[0].method.toUpperCase();
          table.push([method, used.urlBase + path]);
        }
      });

      // Print out the table
      console.log(table.toString() + "\n");
    });
  }

})()
