var include = require('include')
  , expect  = require('chai').expect
  , Hub     = include('/models/hub')
  , db      = include('/config/db')
  , Factory = include('/test/util/factory')

// Clear DB afterEach()
// include('/test/util/clear_db');

describe('HUB', function() {

  describe('Hub.create()', function() {

    var HUB, USER;

    beforeEach(function() {
      return Factory('user').then(function(user) {
        return Hub.create({creator_id: user._id, title: "Some Title", foo: "bar"})
        .then(function(hub) {
          USER = user;
          HUB = hub;
        });
      });
    });

    it("creates a new hub in the db", function() {
      return db.query(
        "MATCH (h:Hub) RETURN h"
      ).then(function(result) {
        expect(result.length).to.eql(1);
        expect(result[0].h.properties.creator_id).to.eql(123);
      });
    });

    it("returns (a promise to) an instance of Hub with the created params", function() {
      expect(HUB).to.be.an.instanceof(Hub);
      expect(HUB.properties.title).to.eql("Some Title");
      expect(HUB.properties.foo).to.eql("bar");
    });

    it("creates a relationship between the {creator_id} user and the new hub", function() {
      return db.query(
        "MATCH (u:Person)-[r:CREATED]-(h:Hub) WHERE id(u) = {uid} AND id(h) = {hid}" +
        "RETURN r", {uid: USER._id, hid: HUB._id}
      ).then(function(result) {
        expect(result.length).to.eql(1);
      });
    });
  }); // End of describe 'Hub.create()'
}); // End of describe 'HUB'
