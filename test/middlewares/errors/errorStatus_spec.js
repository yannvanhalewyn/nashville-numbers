var include     = require('include')
  , chai        = require('chai')
  , sinonChai   = require('sinon-chai')
  , expect      = chai.expect
  , reqres      = require('reqres')
  , sinon       = require('sinon')
  , errorStatus = include('/middlewares/errors/errorStatus')
chai.use(sinonChai);

describe('MIDDLEWARE|errorStatus', function() {
  it("returns a function", function() {
    expect(errorStatus()).to.be.a('function');
  });

  describe('calling that function', function() {
    var req, res, next;
    beforeEach(function() {
      res = reqres.res();
      next = sinon.spy();
      var err = "SOME ERROR";
      var middleware = errorStatus(400);
      middleware(err, req, res);
    });

    it("calls res.status with supplied status", function() {
      expect(res.status).to.have.been.calledWith(400);
    });

    it("calls res.send with the error", function() {
      expect(res.send).to.have.been.calledWith("SOME ERROR");
    });

    it("doesn't call next", function() {
      expect(next).not.to.have.been.called;
    });
  }); // End of describe 'calling that function'
}); // End of describe 'MIDDLEWARE|errorStatus'
