var include   = require('include')
  , reqres    = require('reqres')
  , chai      = require('chai')
  , sinon     = require('sinon')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , db        = include('/config/db')
chai.use(sinonChai);

// Clear DB
include('/test/util/clear_db');

// Require what we're testing
var Router = include('/routers/sheets')
  , Factory = include('/test/util/factory')
// var User       = include('/models/user');
// var Sheet      = include('/models/sheet');

describe('SHEETCONTROLLER', function() {

  var req, res;

  beforeEach(function() {
    req = {isAuthenticated: function() {return false} };
    res = null;
    res = reqres.res();
  });

  /*
   * =========
   * GET#INDEX
   * =========
   */
  describe('GET#index', function() {
    before(function() {
      return seed.bind(this)();
    });

    beforeEach(function() {
      req.url = '/';
    });

    context("/users/me/sheets", function() {
      beforeEach(function() {
        req.params = {user_id: 'me'}
      });

      context("with a valid user logged in", function() {
        beforeEach(function(done) {
          login(this.userA, req);
          Router(reqres.req(req), res);
          res.on('end', done);
        });

        it("returns all the current user's sheets", function() {
          expect(res.render).to.have.been.calledWith('sheets');
        });

        it("sends along userA's sheets", function() {
          var sentSheets = res.render.args[0][1].sheets;
          expect(sentSheets.length).to.eql(2);
          expect(sentSheets[0]._id).to.equal(this.sheets.userA[1]._id);
          expect(sentSheets[1]._id).to.equal(this.sheets.userA[0]._id);
        });
      }); // End of context 'with a valid user logged in'

      context("with no user logged in", function() {
        it("redirects to root", function(done) {
          Router(reqres.req(req), res);
          res.on('end', function() {
            expect(res.redirect).to.have.been.calledWith('/home');
            done();
          });
        });
      }); // End of context 'with no user logged in'
    }); // End of context '/users/me'
  }); // End of GET#index


  /*
   * ========
   * GET#EDIT
   * ========
   */
  describe('GET#edit', function() {
    beforeEach(function() {
      return seed.bind(this)();
    });

    context("with correct logged in user", function() {
      beforeEach(function() {
        login(this.userA, req)
      });

      context("with valid sheetid", function() {
        beforeEach(function(done) {
          var id = this.sheets.userA[1]._id; // A1 has the data
          req.url = "/" + id + "/edit";
          Router(reqres.req(req), res);
          res.on('end', done);
        });

        it("renders the sheet template", function() {
          expect(res.render).to.have.been.calledWith("sheet");
        });

        it("sends along the correct sheet data", function(done) {
          return db.query("MATCH (s:Sheet) RETURN s").then(function() {
            var data = this.sheets.userA[1].properties.data;
            expect(res.render).to.have.been.calledWith('sheet', {state: data});
            done();
          }.bind(this), done).catch(done);
        });
      });

      context("with missing or invalid sheetid", function() {
        it("redirects to /sheets --", function(done) {
          req.url = "/9999/edit"; // Missing sheet
          Router(reqres.req(req), res);
          res.on('end', function() {
            expect(res.redirect).to.have.been.calledWith("/users/me/sheets");
            done();
          });
        });
      }); // End of context 'with missing or invalid sheetid'
    });

    context("when requesting user isn't the author", function() {
      it("redirects to /sheets", function() {
      });
    }); // End of context 'when requesting user isn't the author'
  }); // End of GET#show

  /*
   * ===========
   * POST#CREATE
   * ===========
   */
  describe('POST#create', function() {
    beforeEach(function() {
      req.url = '/';
      req.method = 'POST';
      req.body = {title: "The title", artist: "The artist", visibility: "public"};
    });

    context("with a valid user logged in", function() {
      beforeEach(function(done) {
        return Factory('user').then(function(user) {
          login(user, req);
          Router(reqres.req(req), res);
          res.on('end', done);
        });
      });

      it('creates a new sheet in the database', function() {
        return db.query(
          "MATCH (s:Sheet {title: {title}}) RETURN s", {title: "The title"}
        ).then(function(response) {
          expect(response.length).to.eql(1);
        })
      });

      it("stores the title, artist and authorID", function() {
        return db.query(
          "MATCH (s:Sheet {title: {title}}) RETURN s", {title: "The title"}
        ).then(function(response) {
          var sheet = response[0].s;
          expect(sheet.properties.title).to.eql("The title");
          expect(sheet.properties.artist).to.eql("The artist");
          expect(sheet.properties.visibility).to.eql("public");
        });
      });

      it("redirects to the newly created sheet's edit page", function() {
        return db.query(
          "MATCH (s:Sheet {title: {title}}) RETURN s", {title: "The title"}
        ).then(function(response) {
          var url = "/users/me/sheets/" + response[0].s._id + "/edit";
          expect(res.redirect).to.have.been.calledWith(url);
        })
      });
    }); // END of with valid logged in user

    context("when not logged in", function() {
      it("redirects to /home", function(done) {
        Router(reqres.req(req), res);
        res.on('end', function() {
          expect(res.redirect).to.have.been.calledWith('/home');
          done();
        });
      });
    });
  }); // END of POST#create

  /*
   * ==========
   * PUT#update
   * ==========
   */
  describe('PUT#update', function() {
    context("with correct user logged in", function() {
      context("with valid sheetID", function() {
        it("sends a 200", function() {
        });

        // Not sure if nececessary TODO come back after working on front-end
        it.skip("sends the new data back over", function() {
        });

        it("updates the sheet.data in the DB", function() {
        });

        it("updates the sheets title and artist in the DB", function() {
        });

        it("saving twice doesn't send a 403", function() {
        });

        it.skip("updates the title and artist", function() {
        });
      }); // End of context 'with valid sheetID'

      context("with invalid sheet id", function() {
        it("sends a 404 (1)", function() {
        });
      }); // End of context 'with invalid sheet id'

      context("with mising params object", function() {
        it("sends a 422 (2)", function() {
        });
      }); // End of context 'with missing sheet id'

      context("with missing params.id", function() {
        it("sends a 404 (2)", function() {
        });
      }); // End of context 'with missing sheet id'

      context("with missing body", function() {
        it("sends a 422 (3)", function() {
        });
      }); // End of context 'with missing data'

      context("with empty body", function() {
        it("sends a 422 (4)", function() {
        });
      }); // End of context 'with missing data'

      context.skip("with invalid data", function() {
        it("sends a 406", function() {
        });
      }); // End of context 'with invalid data'
    }); // End of context 'with valid user logged in'

    context("with no user logged in", function() {
      it("sends a 422 (5)", function() {
      });
    }); // End of context 'with no user logged in'

    context("with invalid user logged in", function() {
      it("sends a 401", function() {
      });
    }); // End of context 'with invalid user logged in'

    context("when logged in user isn't the author of the sheet", function() {
      it("sends a 403", function() {
      });
    }); // End of context 'when logged in user isn't the author of the sheet'
  }); // End of describe 'PUT#update'

  /*
   * =============
   * DELET#destroy
   * =============
   */
  describe('DELETE#destroy', function() {
    context("when correct user is logged in", function() {
      context("and existing sheetID is given", function() {
        context("and the request wants HTML", function() {
          it("deletes the sheet document (1)", function() {
          });

          it("redirects to /sheets (1)", function() {
          });
        }); // End of context 'and the request wants HTML'

        context("and the request wants JSON", function() {
          it("deletes the sheet document (2)", function() {
          });

          it("sends a 200 OK with the updated users sheet list", function() {
          });
        }); // End of context 'and the request wants JSON'


      }); // End of context 'and existing sheetID is given'

      context("and unexisting sheetID is given", function() {
        it("sends a 404 (3)", function() {
        });
      }); // End of context 'and unexisting sheetID is given'

      context("and invalid sheetID is given", function() {
        it("sends a 401", function() {
        });
      }); // End of context 'and invalid sheetID is given'

      context("and no sheetID is passed in", function() {
        it("sends a 404 (4)", function() {
        });
      }); // End of context 'and no sheetID is passed in'

      context("and no params obj is passed in", function() {
        it("sends a 422 (6)", function() {
        });
      }); // End of context 'and no params obj is passed in'
    }); // End of context 'when correct user is logged in'

    // NOTE Should I test if the document doesn't get deleted every time?
    context("when logged in user isn't the author", function() {
      it("sends a 404 (5)", function() {
      });

      it("doesn't delete the document from the db", function() {
      });
    }); // End of context 'when logged in user isn't the author'

    context("when invalid user is passed in", function() {
      it("sends a 404 (6)", function() {
      });
    }); // End of context 'when invalid user is passed in'

    context("when no user object is passed on", function() {
      it("sends a 422 (7)", function() {
      });
    }); // End of context 'when no user object is passed on'

  }); // End of describe 'DELETE#destroy'
});


/*
 * ===============
 * PRIVATE HELPERS
 * ===============
 */
// Modifies the res object to pass passport authentication
function login(user, req) {
  req.isAuthenticated = function() {
    return true;
  }
  req.user = user;
}

// Create 2 users: userA and userB. Each of them has 2 sheets, a public and a
// private one.
// We now have this.userA, this.userB, this.sheets.userA, this.sheets.userB as refs
function seed() {
  this.sheets = {};
  return Factory('sheet').then(function(objs) {
    this.userA = objs.user;
    this.sheets.userA = [objs.sheet];
    return Factory('sheet', {uid: this.userA._id, visibility: 'private', data: "FOOBAR"})
    .then(function(sheet2) {
      this.sheets.userA.push(sheet2);
      return Factory('sheet').then(function(objs) {
        this.userB = objs.user;
        this.sheets.userB = [objs.sheet];
        return Factory('sheet', {uid: this.userB._id, visibility: 'private'})
        .then(function(privateSheet) {
          this.sheets.userB.push(privateSheet);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }.bind(this))
}
