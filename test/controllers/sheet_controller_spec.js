var util = require('../util');

// Setup Chai and sinon
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

// Require what we're testing
var Controller = require('../../controllers/sheet_controller');
var User = require('../../models/user');
var Sheet = require('../../models/sheet');

// Just a place where I can keep track
// of entities I created during tests
var ENTITIES;

describe('Controller', function() {
  // Setup stubs
  beforeEach(function() {
    ENTITIES = {users: {}, sheets: {}};
    this.res = {
      render: sinon.spy(),
      sendStatus: sinon.spy(),
      redirect: sinon.spy()
    }
    this.req = {}
  });

  describe('GET#index', function() {
    context('with a user logged in', function() {
      // Setup and store refs to a user and a sheet
      beforeEach(function(done) {
        _createUser("theuser")
        .then(_createSheet)
        .then(function() {
          done();
        });
      });

      it("does't give an error", function() {
        return Controller.index({user: ENTITIES.users["theuser"]}, this.res)
        .then(function() {
          expect(this.res.sendStatus).to.not.have.been.called;
        }.bind(this));
      });

      it("renders the sheets template", function() {
        return Controller.index({user: ENTITIES.users["theuser"]}, this.res)
        .then(function() {
          expect(this.res.render).to.have.been.calledWith("sheets");
        }.bind(this))
      });

      it('grabs all the sheets of the user', function() {
        return Controller.index({user: ENTITIES.users["theuser"]}, this.res)
        .then(function() {
          var sentData = this.res.render.args[0][1].sheets;
          expect(sentData.length).to.eql(1);
          expect(sentData[0].authorID).to.eql(ENTITIES.users['theuser']._id)
        }.bind(this))
      });

      it("doesn't grab another user's data", function() {
        return _createUser("otheruser")
        .then(_createSheet)
        .then(function() {
          return Controller.index({user: ENTITIES.users["theuser"]}, this.res)
          .then(function() {
            var sentData = this.res.render.args[0][1].sheets;
            expect(sentData.length).to.eql(1);
            expect(sentData[0].authorID).not.to.eql(ENTITIES.users['otheruser']._id)
          }.bind(this))
        }.bind(this))
      });
    });

    context("With no user property is invalid", function() {
      beforeEach(function() {
        return Controller.index({user: "invalid"}, this.res);
      });
      it("it sends a 403", function() {
        expect(this.res.sendStatus).to.have.been.calledWith(403);
      });
    });

    context("With an invalid user ID", function() {
      beforeEach(function() {
        return Controller.index({user: {_id: "unexistant"}}, this.res);
      });
      it("redirects to /home", function() {
        expect(this.res.redirect).to.have.been.calledWith('/home');
      });
    })

  });
});

// Fills the refs with user
function _createUser(name) {
  var validUserParams = {firstName: name, provider_id: '123', provider: 'facebook'};
  return new User(validUserParams).save()
  .then(function(user) {
    // Store the ref for later
    ENTITIES.users[name] = user
    return user;
  }, _error);
}

function _createSheet(user) {
  return new Sheet({title: "foo", authorID: user._id}).save()
  .then(function(sheet) {
    sheets = ENTITIES.sheets[user.firstName];
    ENTITIES.sheets[user.firstName] = sheets ? sheets : [];
    ENTITIES.sheets[user.firstName].push(sheet);
    return sheet;
  }, _error)
}

var _error = console.error;
