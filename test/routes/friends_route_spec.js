var include = require('include');
var request = require('supertest');
var expect  = require('chai').expect;
var app     = include('/index');

describe('GET /friends', function() {
  it("works", function() {
    expect(1).to.eql(1);
  });
}); // End of describe 'GET /friends'
