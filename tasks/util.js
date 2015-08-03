module.exports = {
  seed: function() {
    require('../test/util/seed_db').bind(this)();
  },

  routes: function() {
    require('../bin/printRoutes')('/config/routes')
  }
}
