process.env.NODE_ENV = 'test';

var Q        = require('q');
var Sheet    = require('../../models/sheet');
var expect   = require('chai').expect;
var mongoose = require('mongoose');
var config   = require('../../config');

afterEach(function(done) {
  Sheet.remove({}, done);
});

describe('Sheet', function() {
  describe('#instantiation', function() {
    it('is successful', function(done) {
      return Sheet.create({title: "Baby", artist: "Justin Bieber"})
      .then(function(data) { done() },
            function(err) { done("Should not get called here") })
    });

    it('fails when no title', function(done) {
      return Sheet.create({artist: "Justin Bieber"})
      .then(function(data) { done("Should not get called here") },
            function(err) { done() })
    });

    it('fails with empty title', function(done) {
      return Sheet.create({title: ""})
      .then(function(data) { done("Should not get called here") },
            function(err) { done() })
    });

    it('sets the created_at time to current time', function() {
      return Sheet.create({title: "foo"})
      .then(function(data) {
        expect(Date.now() - data.created_at).to.be.below(200);
      });
    })
  });

  describe('#createAtInWords', function() {
    it('returns a correct sentence', function() {
    })
  });
});
