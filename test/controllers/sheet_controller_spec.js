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
      redirect: sinon.spy(),
      send: sinon.spy(),
    }
    this.res.status = sinon.stub().returns(this.res);
    this.req = {};
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

    context("when user object is inexistant", function() {
      it("it sends a 422 (0)", function() {
        Controller.index({}, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(422);
      });
    });

    context("when user object is invalid", function() {
      it("it sends a 401", function() {
        Controller.index({user: "invalid"}, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(401);
      });
    });

    context("With an invalid userID", function() {
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
    beforeEach(function() {
      return _createUser("theuser")
      .then(_createSheet)
      .then(function(sheet) {
        this.req = {
          user: ENTITIES.users["theuser"],
          params: {id: sheet._id}
        }
      }.bind(this))
    });

    context("with correct logged in user", function() {
      context("with valid sheetid", function() {
        beforeEach(function() {
          return Controller.show(this.req, this.res);
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
    });

    context("when another user is requesting", function() {
      beforeEach(function() {
        return _createUser("theotheruser")
        .then(function() {
          this.req.user = ENTITIES.users["theotheruser"];
        }.bind(this));
      });

      context("when the requested sheet is public", function() {
        it("renders the sheet template with the correct data but readonly", function() {
          return Controller.show(this.req, this.res)
          .then(function() {
            var expectedData = ENTITIES.sheets["theuser"][0].data;
            expect(this.res.render).to.have.been.calledWith(
              'sheet', {active: {active_sheets: true}, state: expectedData, readOnly: true}
            );
          }.bind(this));
        });
      }); // End of context 'when the requested sheet is public'

      context("when the requested sheet is private", function() {
        beforeEach(function() {
          var authorID = ENTITIES.users["theuser"]._id;
          return Sheet.create({title: "privateSheet", authorID: authorID, visibility: 'private'})
          .then(function(sheet) {
            this.req.params.id = sheet._id;
          }.bind(this));
        });

        it("redirects to /sheets (1)", function() {
          return Controller.show(this.req, this.res)
          .then(function() {
            expect(this.res.redirect).to.have.been.calledWith("/sheets");
          }.bind(this));
        });
      }); // End of context 'when the requested sheet is private'
    }); // End of context 'when another user is requesting'

    context("when user property is inexistant", function() {
      it("it sends a 422 (1)", function(done) {
        delete this.req.user;
        Controller.show(this.req, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(422);
        done();
      });
    });

    context("when user property is invalid", function() {
      it("it sends a 401", function() {
        this.req.user = "invalid";
        Controller.show(this.req, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(401);
      });
    });

    // NOTE come back later, is this necessary?
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
  }); // End of GET#show

  /*
   * ===========
   * POST#CREATE
   * ===========
   */
  describe('POST#create', function() {
    beforeEach(function() {
      this.req.body = {title: "theTitle", artist: "theArtist"}
    });

    context("with a valid user logged in", function() {
      beforeEach(function() {
        return _createUser("theuser")
        .then(function(createdUser) {
          this.req.user = createdUser;
        }.bind(this))
      });

      context("when the sheet title is present", function() {
        beforeEach(function() {
          return Controller.create(this.req, this.res)
        });

        it('creates a new sheet in the database', function() {
          return Sheet.count()
          .then(function(count) {
            expect(count).to.eql(1);
          });
        });

        it("stores the title, artist and authorID", function() {
          return Sheet.findOne({title: "theTitle"}).exec()
          .then(function(sheet) {
            expect(sheet.title).to.eql("theTitle");
            expect(sheet.artist).to.eql("theArtist");
            expect(sheet.authorID).to.eql(ENTITIES.users["theuser"]._id);
          });
        });

        it("redirects to the newly created sheet", function() {
          return Sheet.findOne({title: "theTitle"}).exec()
          .then(function(sheet) {
            var url = ('/sheets/' + sheet._id).toString();
            expect(this.res.redirect).to.have.been.calledWith(url);
          }.bind(this));
        });
      }); // End of when the sheet title is present

      context("when sheet title is invalid", function() {
        it("sends a 400", function() {
          this.req.body.title = "";
          Controller.create(this.req, this.res)
          expect(this.res.sendStatus).to.have.been.calledWith(400);
        });
      });
    }); // END of with valid logged in user

    context("when not logged in", function() {
      it("sends a 403", function() {
        Controller.create(this.req, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(403);
      });
    });

    context("when user invalid", function() {
      it("redirects to /home", function() {
        this.req.user = "invalid";
        return Controller.create(this.req, this.res)
        .then(function() {
          expect(this.res.redirect).to.have.been.calledWith('/home');
        }.bind(this));
      });
    });
  }); // END of POST#create

  /*
   * ==========
   * PUT#update
   * ==========
   */
  describe('PUT#update', function() {
    beforeEach(function() {
      return _createUser("theuser")
      .then(_createSheet)
      .then(function(thesheet) {
        this.req = {
          body: {main:{title:"newTitle",artist:"newArtist"}},
          user: ENTITIES.users["theuser"],
          params: {id: thesheet._id}
        };
      }.bind(this));
    });

    context("with correct user logged in", function() {
      context("with valid sheetID", function() {
        beforeEach(function() {
          return Controller.update(this.req, this.res);
        });

        it("sends a 200", function() {
          expect(this.res.status).to.have.been.calledWith(200);
        });

        // Not sure if nececessary TODO come back after working on front-end
        it.skip("sends the new data back over", function() {
          return Sheet.findOne({authorID: ENTITIES.users["theuser"]._id})
          .then(function(sheet) {
            expect(this.res.send).to.have.been.calledWith(sheet.data);
          }.bind(this));
        });

        it("updates the sheet.data in the DB", function() {
          return Sheet.findOne({authorID: ENTITIES.users["theuser"]._id})
          .then(function(sheet) {
            expect(sheet.data).to.eql(JSON.stringify(this.req.body));
          }.bind(this));
        });

        it("updates the sheets title and artist in the DB", function() {
          return Sheet.findOne({authorID: ENTITIES.users["theuser"]._id})
          .then(function(sheet) {
            expect(sheet.title).to.eql("newTitle");
            expect(sheet.artist).to.eql("newArtist");
          }.bind(this));
        });

        it("saving twice doesn't send a 403", function() {
          return Controller.update(this.req, this.res)
          .then(function() {
            expect(this.res.status).to.have.been.calledWith(200);
            expect(this.res.sendStatus).not.to.have.been.calledWith(403);
          }.bind(this))
        });

        it.skip("updates the title and artist", function() {
        });
      }); // End of context 'with valid sheetID'

      context("with invalid sheet id", function() {
        it("sends a 404 (1)", function(done) {
          this.req.params.id = "invalid";
          Controller.update(this.req, this.res);
          expect(this.res.sendStatus).to.have.been.calledWith(404);
          done();
        });
      }); // End of context 'with invalid sheet id'

      context("with mising params object", function() {
        it("sends a 422 (2)", function(done) {
          delete this.req.params;
          Controller.update(this.req, this.res);
          expect(this.res.sendStatus).to.have.been.calledWith(422);
          done();
        });
      }); // End of context 'with missing sheet id'

      context("with missing params.id", function() {
        it("sends a 404 (2)", function(done) {
          delete this.req.params.id;
          Controller.update(this.req, this.res);
          expect(this.res.sendStatus).to.have.been.calledWith(404);
          done();
        });
      }); // End of context 'with missing sheet id'

      context("with missing body", function() {
        it("sends a 422 (3)", function(done) {
          delete this.req.body;
          Controller.update(this.req, this.res);
          expect(this.res.sendStatus).to.have.been.calledWith(422);
          done();
        });
      }); // End of context 'with missing data'

      context("with empty body", function() {
        it("sends a 422 (4)", function() {
          this.req.body = {};
          Controller.update(this.req, this.res);
          expect(this.res.sendStatus).to.have.been.calledWith(406);
        });
      }); // End of context 'with missing data'

      context.skip("with invalid data", function() {
        it("sends a 406", function() {
        });
      }); // End of context 'with invalid data'
    }); // End of context 'with valid user logged in'

    context("with no user logged in", function() {
      it("sends a 422 (5)", function(done) {
        delete this.req.user;
        Controller.update(this.req, this.res);
        expect(this.res.sendStatus).to.have.been.calledWith(422);
        done();
      });
    }); // End of context 'with no user logged in'

    context("with invalid user logged in", function() {
      it("sends a 401", function(done) {
        this.req.user = "invalid";
        Controller.update(this.req, this.res);
        expect(this.res.sendStatus).to.have.been.calledWith(401);
        done();
      });
    }); // End of context 'with invalid user logged in'

    context("when logged in user isn't the author of the sheet", function() {
      it("sends a 403", function(done) {
        return _createUser("otheruser")
        .then(function(otherUser) {
          this.req.user = otherUser;
          return Controller.update(this.req, this.res)
          .then(function() {
            expect(this.res.sendStatus).to.have.been.calledWith(403);
            done();
          }.bind(this))
        }.bind(this));
      });
    }); // End of context 'when logged in user isn't the author of the sheet'
  }); // End of describe 'PUT#update'

  /*
   * =============
   * DELET#destroy
   * =============
   */
  describe('DELETE#destroy', function() {
    beforeEach(function() {
      return _createUser("theuser")
      .then(_createSheet)
      .then(function(thesheet) {
        this.req = {
          user: ENTITIES.users["theuser"],
          params: {id: thesheet._id},
          headers: {accept: "application/html"},
          accepts: function(type) {
            return this.headers.accept.indexOf(type) > -1;
          }
        };
      }.bind(this));
    });

    context("when correct user is logged in", function() {
      context("and existing sheetID is given", function() {
        context("and the request wants HTML", function() {
          beforeEach(function() {
            return Controller.destroy(this.req, this.res);
          });

          it("deletes the sheet document (1)", function() {
            return Sheet.count()
            .then(function(count) {
              expect(count).to.eql(0);
            });
          });

          it("redirects to /sheets (1)", function() {
            expect(this.res.redirect).to.have.been.calledWith('/sheets');
          });
        }); // End of context 'and the request wants HTML'

        context("and the request wants JSON", function() {
          beforeEach(function() {
            this.req.headers.accept = "application/json";
            // Create another sheet to test the response data
          });

          it("deletes the sheet document (2)", function() {
            return Controller.destroy(this.req, this.res)
            .then(function() {
              return Sheet.count()
              .then(function(count) {
                expect(count).to.eql(0);
              })
            })
          });

          it("sends a 200 OK with the updated users sheet list", function() {
            return _createSheet(this.req.user)
            .then(Controller.destroy.bind(this, this.req, this.res))
            .then(function() {
              expect(this.res.status).to.have.been.calledWith(200);
              // Grab the updated users sheet list and compare with response
              return ENTITIES.users["theuser"].sheets
              .then(function(sheets) {
                var sentData = this.res.send.args[0][0];
                expect(sentData.length).to.eql(1);
                expect(sentData[0]._id).to.eql(sheets[0]._id);
              }.bind(this))
            }.bind(this))
          });
        }); // End of context 'and the request wants JSON'


      }); // End of context 'and existing sheetID is given'

      context("and unexisting sheetID is given", function() {
        beforeEach(function() {
          this.req.params.id = "01234567890123456789abcd";
          return Controller.destroy(this.req, this.res);
        });

        it("sends a 404 (3)", function() {
          expect(this.res.sendStatus).to.have.been.calledWith(404);
        });
      }); // End of context 'and unexisting sheetID is given'

      context("and invalid sheetID is given", function() {
        it("sends a 401", function() {
          this.req.params.id = "invalid";
          return Controller.destroy(this.req, this.res)
          .then(function() {
            expect(this.res.sendStatus).to.have.been.calledWith(401);
          }.bind(this));
        });
      }); // End of context 'and invalid sheetID is given'

      context("and no sheetID is passed in", function() {
        it("sends a 404 (4)", function() {
          delete this.req.params.id;
          return Controller.destroy(this.req, this.res)
          .then(function() {
            expect(this.res.sendStatus).to.have.been.calledWith(404);
          }.bind(this));
        });
      }); // End of context 'and no sheetID is passed in'

      context("and no params obj is passed in", function() {
        it("sends a 422 (6)", function(done) {
          delete this.req.params;
          Controller.destroy(this.req, this.res)
          expect(this.res.sendStatus).to.have.been.calledWith(422);
          done();
        });
      }); // End of context 'and no params obj is passed in'
    }); // End of context 'when correct user is logged in'

    // NOTE Should I test if the document doesn't get deleted every time?
    context("when logged in user isn't the author", function() {
      beforeEach(function() {
        return _createUser("otheruser")
        .then(function(otherUser) {
          this.req.user = otherUser;
          return Controller.destroy(this.req, this.res);
        }.bind(this));
      });

      it("sends a 404 (5)", function() {
        expect(this.res.sendStatus).to.have.been.calledWith(404);
      });

      it("doesn't delete the document from the db", function() {
        Sheet.count().then(function(count) {
          expect(count).to.eql(1);
        });
      });
    }); // End of context 'when logged in user isn't the author'

    context("when invalid user is passed in", function() {
      it("sends a 404 (6)", function() {
        this.req.user = "invalid";
        return Controller.destroy(this.req, this.res)
        .then(function() {
          expect(this.res.sendStatus).to.have.been.calledWith(404);
        }.bind(this));
      });
    }); // End of context 'when invalid user is passed in'

    context("when no user object is passed on", function() {
      it("sends a 422 (7)", function(done) {
        delete this.req.user;
        Controller.destroy(this.req, this.res)
        expect(this.res.sendStatus).to.have.been.calledWith(422);
        done();
      });
    }); // End of context 'when no user object is passed on'

  }); // End of describe 'DELETE#destroy'
});


/*
 * ===============
 * PRIVATE HELPERS
 * ===============
 */

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
