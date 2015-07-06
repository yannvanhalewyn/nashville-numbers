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

describe('SHEETCONTROLLER', function() {
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

/*
 * =========
 * GET#INDEX
 * =========
 */
  describe('GET#index', function() {
    // Setup and store refs to a user and a sheet
    beforeEach(function() {
      return _createUser("theuser")
      .then(_createSheet)
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

    context("when user property is inexistant", function() {
      it("it sends a 403", function() {
        Controller.index({}, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(403);
      });
    });

    context("when user property is invalid", function() {
      it("it sends a 403", function() {
        Controller.index({user: "invalid"}, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(403);
      });
    });

    context("With an invalid user ID", function() {
      it("redirects to /", function() {
        return Controller.index({user: {_id: "unexistant"}}, this.res)
        .then(function() {
          expect(this.res.redirect).to.have.been.calledWith('/');
        }.bind(this))
      });
    }); // End of when invalid user ID
  }); // End of GET#index


/*
 * ========
 * GET#SHOW
 * ========
 */
  describe('GET#show', function() {
    context("when user property is inexistant", function() {
      it("it sends a 403", function() {
        Controller.show({}, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(403);
      });
    });

    context("when user property is invalid", function() {
      it("it sends a 403", function() {
        Controller.show({user: "invalid"}, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(403);
      });
    });

    // NOTE come back later
    context.skip("With an invalid logged in user ID", function() {
      context("with no sheet id", function() {
        it("redirects to /", function() {
          Controller.show({user: {_id: "unexistant"}}, this.res)
          expect(this.res.redirect).to.have.been.calledWith('/');
        });
      });

      context("with a sheet id", function() {
        it("redirects to /", function() {
          return Controller.show({user: {_id: "unexistant"}, params: {id: '2'}}, this.res)
          .then(function() {
            expect(this.res.redirect).to.have.been.calledWith('/');
          }.bind(this))
        });
      });
    }); // End of with invalid logged in userID


    // WITH VALID USER
    // ===============
    context("with valid logged in user", function() {
      beforeEach(function() {
        return _createUser("theuser")
        .then(_createSheet)
      });

      context("with no sheetid param", function() {
        it("redirects to /sheets", function() {
          Controller.show({user: ENTITIES.users["theuser"]}, this.res)
          expect(this.res.redirect).to.have.been.calledWith("/sheets");
        });
      });

      context("with valid sheetid", function() {
        beforeEach(function() {
          // Create a private sheet
          authorID = ENTITIES.users["theuser"]._id;
          return Sheet.create({title: "private", visibility: "private",
                              authorID: authorID, data: "dataOfThePrivateOne"})
          .then(function(privateSheet) {
            ENTITIES.sheets["theprivateone"] = privateSheet;
          });
        });

        context("when the requesting user owns the sheet", function() {
          context("when the requested sheet is public", function() {
            beforeEach(function() {
              var sheetID = ENTITIES.sheets["theuser"][0]._id;
              return Controller.show({
                user: ENTITIES.users["theuser"],
                params: {id: sheetID}
              }, this.res);
            });

            it("renders the sheet template", function() {
              expect(this.res.render).to.have.been.calledWith('sheet');
            });

            it("sends along the correct sheet data", function() {
              // Sorry for the hack. Check _createSheet for how thedata is created
              var expectedData = ENTITIES.sheets["theuser"][0].data;
              expect(this.res.render.args[0][1].state).to.eql(expectedData);
            });
          });

          context("when the requested sheet is private", function() {
            beforeEach(function() {
              var sheetID = ENTITIES.sheets["theprivateone"]._id;
              return Controller.show({
                user: ENTITIES.users["theuser"],
                params: {id: sheetID}
              }, this.res);
            });

            it("renders the sheet", function() {
              expect(this.res.render).to.have.been.calledWith('sheet');
            });

            it("sends along the correct sheet data", function() {
              var expectedData = ENTITIES.sheets["theprivateone"].data;
              expect(this.res.render.args[0][1].state).to.eql(expectedData);
            });
          });
        }); // End of when the requesting user owns the sheet


        context("when the requesting user doesn't own the sheet", function() {
          beforeEach(function() {
            return _createUser("theOtherUser");
          });

          context("when the requested sheet is public", function() {
            beforeEach(function() {
              var sheetID = ENTITIES.sheets["theuser"][0]._id;
              return Controller.show({
                user: ENTITIES.users["theOtherUser"],
                params: {id: sheetID}
              }, this.res);
            });

            it("renders the sheet template", function() {
              expect(this.res.render).to.have.been.calledWith('sheet');
            });

            it("sends along the correct sheet data", function() {
              // Sorry for the hack. Check _createSheet for how thedata is created
              var expectedData = ENTITIES.sheets["theuser"][0].data;
              expect(this.res.render.args[0][1].state).to.eql(expectedData);
            });

            it("sends a read-only flag", function() {
              expect(this.res.render.args[0][1].readOnly).to.eql(true)
            });

          });

          context("when the requested sheet is private", function() {
            beforeEach(function() {
              var sheetID = ENTITIES.sheets["theprivateone"]._id;
              return Controller.show({
                user: ENTITIES.users["theOtherUser"],
                params: {id: sheetID}
              }, this.res);
            });

            it("redirects to /sheetsss", function() {
              expect(this.res.redirect).to.have.been.called;
            });
          });
        });
      })
    });

  });
});

// create a user and store it under ENTITIES.users[`name`]
function _createUser(name) {
  var validUserParams = {firstName: name, provider_id: '123', provider: 'facebook'};
  return new User(validUserParams).save()
  .then(function(user) {
    // Store the ref for later
    ENTITIES.users[name] = user
    return user;
  }, _error);
}

// create a sheet owned by user and store it in the array ENTITIES.sheets[`username`]
function _createSheet(user) {
  var fakeData = user.firstName+"sheetData" + Math.floor(Math.random() * 1000);
  return new Sheet({title: "foo", authorID: user._id, data: fakeData}).save()
  .then(function(sheet) {
    sheets = ENTITIES.sheets[user.firstName];
    ENTITIES.sheets[user.firstName] = sheets ? sheets : [];
    ENTITIES.sheets[user.firstName].push(sheet);
    return sheet;
  }, _error)
}

var _error = console.error;
