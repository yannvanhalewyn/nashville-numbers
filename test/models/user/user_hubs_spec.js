var include   = require('include')
  , chai      = require('chai')
  , sinonChai = require('sinon-chai')
  , expect    = chai.expect
  , sinon     = require('sinon')
  , Q         = require('q')
  , Hub       = include('/models/hub')
  , Factory   = include('/test/util/factory')
chai.use(sinonChai);

describe('USER-HUBS methods', function() {

  var USER;

  beforeEach(function() {
    sinon.stub(Hub, 'create').returns(Q(new Hub()))
    return Factory('user').then(function(user) {
      USER = user;
    });
  });

  afterEach(function() {
    Hub.create.restore();
  });

  describe('user#createHub()', function() {

    var HUB;

    beforeEach(function() {
      return USER.createHub("My Hub").then(function(hub) {
        HUB = hub;
      });
    });

    it("calls create on Hub model with it's id", function() {
      expect(Hub.create).to.have.been.calledWith({creator_id: USER._id, name: "My Hub"});
    });

    it("returns a promise for that hub model", function() {
      expect(HUB).to.be.an.instanceof(Hub);
    });
  }); // End of describe 'user#createHub()'
}); // End of describe 'USER-HUBS methods'
