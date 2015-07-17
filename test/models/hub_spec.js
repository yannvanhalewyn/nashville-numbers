var include = require('include')
  , expect  = require('chai').expect
  , Hub     = include('/models/hub')
  , db      = include('/config/db')
  , Factory = include('/test/util/factory')

// Clear DB afterEach()
// include('/test/util/clear_db');

describe('HUB', function() {

/*
 * ======
 * Create
 * ======
 */
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

/*
 * ==========
 * findById()
 * ==========
 */
  describe('Hub.FindById()', function() {

    var CREATED_HUB, FOUND_HUB;

    context("when a hub exists", function() {
      beforeEach(function() {
        return Factory('hub').then(function(entities) {
          return Hub.findById(entities.hub._id).then(function(foundHub) {
            CREATED_HUB = entities.hub;
            FOUND_HUB = foundHub;
          });
        });
      });

      it("returns the correct hub", function() {
        expect(FOUND_HUB._id).to.equal(CREATED_HUB._id);
        expect(FOUND_HUB.properties).to.eql(CREATED_HUB.properties);
      });

      it("returns an instance of HUB", function() {
        expect(FOUND_HUB).to.be.an.instanceof(Hub);
      });
    }); // End of context 'when a hub exists'

    context("when a hub doesn't exist", function() {
      it("throws a 'hub not found' error", function(done) {
        return Hub.findById(999).then(done, function(err) {
          expect(err).to.eql("Could not find hub with id 999");
          done();
        }).catch(done);
      });
    }); // End of context 'when a hub doesn't exist'
  }); // End of describe 'Hub.FindById()'
}); // End of describe 'HUB'
