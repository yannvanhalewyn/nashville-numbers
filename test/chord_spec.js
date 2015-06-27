var Chord            = require('../src/chord');
var ChordData        = require('../src/chord-data');
var ChordDataFactory = require('../src/chord-data-factory');
var sinon            = require('sinon');
var chai             = require('chai');
var expect           = chai.expect;
var sinonChai        = require('sinon-chai');
chai.use(sinonChai)

describe ('Chord', function() {
  describe ('#init()', function() {
    context("with a string as param", function() {
      it('stores that string as raw property', function() {
        var c = new Chord("em");
        expect(c.raw).to.equal("em");
      });
    });

    context("without any params", function() {
      it('stores an empty string as raw property', function() {
        var c = new Chord();
        expect(c.raw).to.equal("");
      });
    });

    it.skip('interpolates the raw string', function() {
      expect(new Chord().data).to.not.be.undefined;
    });
  });

  describe('#interpolate()', function() {
    beforeEach(function() {
      this.chord = new Chord("em7b5");
    });

    it('stores a ChordData object', function() {
      this.chord.data = null;
      this.chord.interpolate();
      expect(this.chord.data).to.be.instanceof(ChordData);
    });

    it('calls the chordfactory for a chorddata object from the rough string', function() {
      sinon.stub(ChordDataFactory, "fromRawString");
      this.chord.interpolate();
      expect(ChordDataFactory.fromRawString).to.have.been.calledOnce;
      ChordDataFactory.fromRawString.restore();
    });

    it('sanity check', function() {
      this.chord.interpolate();
      expect(this.chord.data.root).to.equal("e");
      expect(this.chord.data.triad).to.equal("m");
      expect(this.chord.data.seventh).to.equal("7");
    });
  });

  describe ('#musicNotationString()', function() {
    beforeEach(function() {
      this.chord = new Chord("em7b5");
    });

    it('calls interpolate()', function() {
      sinon.spy(this.chord, "interpolate");
      this.chord.musicNotationString();
      expect(this.chord.interpolate).to.have.been.calledOnce;
      this.chord.interpolate.restore();
    });

    it('capitalizes roots', function() {
      var c = new Chord("e");
      expect(c.musicNotationString()).to.equal("E");
    });

    context("when an accidental is before the root", function() {
      context("when #", function() {
        it('prints it out correctly', function() {
          var c = new Chord("#7");
          expect(c.musicNotationString()).to.equal("#7");
        });
      });

      context("when b", function() {
        it('prints it out correctly', function() {
          var c = new Chord("b7");
          expect(c.musicNotationString()).to.equal("@7");
        });
      });
    });

    it('replaces min with -', function() {
      var c = new Chord("emin");
      expect(c.musicNotationString()).to.equal("E-");
    });

    it('replaces m with -', function() {
      var c = new Chord("em");
      expect(c.musicNotationString()).to.equal("E-");
    });

    it('replaces aug with +', function() {
      var c = new Chord("bbaug");
      expect(c.musicNotationString()).to.equal("B@+");
    });

    it('replaces maj with y', function() {
      var c = new Chord("emaj7");
      expect(c.musicNotationString()).to.equal("Ey");
    });
  });

  describe("#getRootAsMusicString()", function() {
    beforeEach(function() {
      this.chord = new Chord();
    });

    context("when length is < 2", function() {
      it("returns an uppercased root", function() {
        this.chord.data = {root: "e"};
        expect(this.chord.getRootAsMusicNotationString()).to.equal("E");
      });
    });

    context("when root contains #", function() {
      it("returns an uppercased root too", function() {
        this.chord.data = {root: "e#"};
        expect(this.chord.getRootAsMusicNotationString()).to.equal("E#");
      });
    });

    context("when root is flat", function() {
      context("and accidental is before key", function() {
        it("replaces the first char by correct symbol", function() {
          this.chord.data = {root: "b7"};
          expect(this.chord.getRootAsMusicNotationString()).to.equal("@7");
        });
      });

      context("and accidental is after key", function() {
        it("replaces the second char by correct symbol", function() {
          this.chord.data = {root: "ab"};
          expect(this.chord.getRootAsMusicNotationString()).to.equal("A@");
        });
      });
    });

    it("handles bb", function() {
      this.chord.data = {root: "bb"};
      expect(this.chord.getRootAsMusicNotationString()).to.equal("B@");
    });

    it("handles b7", function() {
      this.chord.data = {root: "b7"};
      expect(this.chord.getRootAsMusicNotationString()).to.equal("@7");
    });

    it("handles B7", function() {
      this.chord.data = {root: "B7"};
      expect(this.chord.getRootAsMusicNotationString()).to.equal("B7");
    });
  });

});
