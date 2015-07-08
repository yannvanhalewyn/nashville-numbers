var include = require('include');
var expect  = require('chai').expect;
var util    = include('/test/util/mock_db');
var Sheet   = include('/models/sheet');
var User    = include('/models/user');

var USER;

describe('Sheet', function() {
  beforeEach(function(done) {
    var validUserParams = {firstName: "Yann", provider_id: '1', provider: 'facebook'};
    User.create(validUserParams)
    .then(function(user) {
      USER = user;
      done();
    });
  });

  describe('#instantiation', function() {
    it('is successful', function(done) {
      new Sheet({title: "Baby", artist: "Justin Bieber", authorID: USER._id}).save(done);
    });

    it("Sets the correct default data", function() {
      return new Sheet({title: "Baby", artist: "Justin Bieber", authorID: USER._id}).save()
      .then(function(sheet) {
        expData = JSON.stringify({
          main: { title: "Baby", artist: "Justin Bieber", dbid: sheet._id }
        });
        expect(sheet.data).to.eql(expData);
      });
    });

    it('fails when no title', function(done) {
      return Sheet.create({artist: "Justin Bieber", authorID: USER._id})
      .then(function(data) { done("Should not get called here") },
            function(err) { done() });
    });

    it('fails with empty title', function(done) {
      return Sheet.create({title: "", authorID: USER._id})
      .then(function(data) { done("Should not get called here") },
            function(err) { done() });
    });

    it('fails with no authorID title', function(done) {
      return Sheet.create({title: "foo"})
      .then(function(data) { done("Should not get called here") },
            function(err) { done() });
    });

    it('fails with invalid authorID title', function(done) {
      return Sheet.create({title: "foo", authorID: "invalid"})
      .then(function(data) { done("Should not get called here") },
            function(err) { done() });
    });

    it('sets the visibility to public', function() {
      return Sheet.create({title: "foo", authorID: USER._id})
      .then(function(data) {
        expect(data.visibility).to.eql('public');
      });
    });

    it('sets the timestamps time to current time', function() {
      return Sheet.create({title: "foo", authorID: USER._id})
      .then(function(data) {
        console.log(data.updated_at);
        expect(Date.now() - data.created_at).to.be.below(200);
        expect(Date.now() - data.updated_at).to.be.below(200);
      });
    });
  });

  describe('#updating', function() {
    it('refreshes the updated_at variable', function() {
      return Sheet.create({title: "foo", updated_at: Date.now() - 1000 * 60, authorID: USER._id})
      .then(function(sheet) {
        return sheet.update({artist: "bar"})
        .then(function() {
          return Sheet.findById(sheet._id).exec()
          .then(function(updatedSheet) {
            expect(updatedSheet.updated_at).not.to.eql(updatedSheet.created_at);
          });
        });
      });
    });
  });

  describe ('virtual', function() {
    describe('#createAtInWords', function() {
      it('returns a correct sentence', function() {
        return Sheet.create({title: "foo", created_at: Date.now() - 1000 * 60 * 60 * 2,
                            authorID: USER._id})
        .then(function(data) {
          expect(data.createdAtInWords).to.eql("2 hours ago");
        });
      });
    });

    describe('#author', function() {
      it('returns the correct author', function() {
        return Sheet.create({title: "foo", authorID: USER._id})
        .then(function(sheet) {
          return sheet.author.then(function(author) {
            expect(author.firstName).to.eql("Yann");
            expect(author._id).to.eql(USER._id);
            expect(author.provider_id).to.eql(USER.provider_id);
          });
        })
      });
    });
  });
});
