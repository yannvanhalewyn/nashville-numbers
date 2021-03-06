var include    = require('include')
  , chai       = require('chai')
  , sinonChai  = require('sinon-chai')
  , expect     = chai.expect
  , reqres     = require('reqres')
  , Controller = include('/controllers/hubs/hubs_controller')
  , Factory    = include('/test/util/factory')
  , Q          = require('q')
  , sinon      = require('sinon')
chai.use(sinonChai);

describe('HUBS_CONTROLLER', function() {

  var req, res, USER;

  beforeEach(function() {
    req = reqres.req();
    res = reqres.res();
    return Factory('user').then(function(user) {
      USER = user;
    });
  });

  describe('GET/index', function() {
    beforeEach(function(done) {
      sinon.stub(USER, 'getHubs').returns(Q(["DUMMY", "ARRAY"]));
      req.user = USER;
      Controller.index(req, res);
      res.on('end', done)
    });

    it("calls req.user.getHubs", function() {
      expect(req.user.getHubs).to.have.been.called;
    });

    it("renders the hubs page with the response from user.getHubs()", function() {
      var expected = {hubs: JSON.stringify(["DUMMY", "ARRAY"])};
      expect(res.render).to.have.been.calledWith('hubs', expected);
    });
  }); // End of describe 'GET/index'

  describe('GET/show', function() {
    var HUB = {_id: 123, properties: {dummyHub: true}};
    var RELATIONSHIP = {dummyRelationship: true};
    beforeEach(function() {
      req.target_hub = HUB;
      req.target_hub_relationship_to_user = RELATIONSHIP;
      Controller.show(req, res);
    });

    it("renders the hub template", function() {
      expect(res.render).to.have.been.calledWith('hub');
    });

    it("sends along the correct data", function() {
      expect(res.render).to.have.been.calledWith('hub', {state: JSON.stringify({
        hub: HUB, relationship: RELATIONSHIP
      })});
    });
  }); // End of describe 'GET/show'

  describe('POST/create', function() {
    beforeEach(function(done) {
      sinon.stub(USER, 'createHub').returns(Q(dummyHub()));
      req.body = {name: "The Hubs Name"};
      req.user = USER;
      Controller.create(req, res);
      res.on('end', done);
    });

    it("calls user.createHub with the sent in hub name", function() {
      expect(USER.createHub).to.have.been.calledWith("The Hubs Name");
    });

    it("redirects to the newly created hub", function() {
      expect(res.redirect).to.have.been.calledWith("/hubs/" + dummyHub()._id);
    });
  }); // End of describe 'POST/create'

  describe('DELETE/destroy', function() {
    var destroyStub;
    beforeEach(function() {
      destroyStub = sinon.stub().returns(Q());
      req.target_hub = {destroy: destroyStub}
    });

    context("when request is xhr", function() {
      beforeEach(function(done) {
        req.xhr = true;
        Controller.destroy(req, res);
        res.on('end', done)
      });

      it("destroys the target hub", function() {
        expect(destroyStub).to.have.been.called;
      });

      it("sends a JSON destroyed flag", function() {
        expect(res.json).to.have.been.calledWith({destroyed: true});
      });
    }); // End of context 'when request is xhr'

    context("when request is not xhr", function() {
      beforeEach(function(done) {
        req.xhr = false;
        Controller.destroy(req, res);
        res.on('end', done)
      });

      it("redirects to the hubs page", function() {
        expect(res.redirect).to.have.been.calledWith("/hubs");
      });
    }); // End of context 'when request is not xhr'
  }); // End of describe 'DELETE/destroy'
}); // End of describe 'HUBS_CONTROLLER'

function dummyHub() {
  return {
    _id: 123,
    properties: {
      name: "The Hubs Name"
    }
  }
}
