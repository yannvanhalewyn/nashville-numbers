var include     = require('include');
var expect      = require('chai').expect;
var _           = require('lodash');
var DataManager = include('/app/sheetEditor/stores/sheetStoreDataManager');

var DEFAULT_NUM_BARS_IN_ROW = 4;

describe('SheetStoreDataManager', function() {

  describe('#set/getData()', function() {
    it('is empty on start', function() {
      expect(DataManager.getData()).to.be.empty;
    });

    it('stores the data', function() {
      DataManager.setData({foo: "bar"});
      expect(data().foo).to.eql("bar");
    });

    context("when no sections exist in the sheet", function() {
      beforeEach(function() {
       DataManager.setData({main: {title: "title"}});
      });

      it("adds a brand new section", function() {
        expect(_.size(_.keys(data().sections))).to.eql(1);
      });

      it("adds a brand new row", function() {
        expect(_.size(_.keys(data().rows))).to.eql(1);
      });

      it("adds DEFAULT_NUM brand new bars and chords", function() {
        expect(_.size(_.keys(data().bars))).to.eql(4);
        expect(_.size(_.keys(data().chords))).to.eql(4);
      });
    }); // End of context 'when no sections exist in the sheet'
  });

  describe('managing data', function() {
    beforeEach(function() {
      DataManager.setData(originalData());
    });

/*
 * =================
 * updateChordText()
 * =================
 */
    describe('#updateChordText()', function() {
      it('stores the new text in the correct chord', function() {
        DataManager.updateChordText('chord3', "popo");
        expect(data().chords['chord3'].raw).to.eql('popo');
      });

      it("doesn't store a new chord when id is unexistant", function() {
        DataManager.updateChordText('invalid', "popo");
        expect(data().chords['invalid']).to.be.undefined;
      });
    });

/*
 * ==========
 * addChord()
 * ==========
 */
    describe('#addChord()', function() {
      context('when existing barID is given', function() {
        context('when no chordID is given', function() {
          beforeEach(function() {
            DataManager.addChord('bar2');
          });

          it ('adds a chord to the entities', function() {
            var chordCount = _.size(data().chords);
            var originalChordCount = _.size(originalData().chords);
            expect(chordCount).to.eql(originalChordCount + 1);
          });

          it('inserts a chord at the end of the given bar', function() {
            var newID = _.last(_.keys(data().chords));
            expect(data().bars['bar2'].chords).to.eql(['chord3', 'chord4', newID]);
          });

          it('sets the ID param on the chord entity', function() {
            var newID = _.last(_.keys(data().chords));
            expect(data().chords[newID].id).to.eql(newID);
          });
        });

        context('when chordID is given', function() {
          context('when chordID is valid', function() {
            it('inserts a new chord in bar at the correct index', function() {
              DataManager.addChord('bar1', 'chord1');
              addedChordID = _.last(_.keys(data().chords));
              var index = data().bars['bar1'].chords.indexOf(addedChordID);
              expect(index).to.eql(1);
            });
          })

          context('when chordID is invalid', function() {
            it('appends a new chord at the end of the bar', function() {
              DataManager.addChord('bar1', 'invalid');
              addedChordID = _.last(_.keys(data().chords));
              expect(data().bars['bar1'].chords).to.eql(
                          ['chord1', 'chord2', addedChordID]);
            });
          });
        });
      });

      context('when invalid barID is given', function() {
        beforeEach(function() {
          DataManager.addChord('invalid');
        });

        it("doesn't add a chord entity", function() {
          var chordCount = _.size(data().chords);
          var originalChordCount = _.size(originalData().chords);
          expect(chordCount).to.eql(originalChordCount);
        });

        it("doesn't create the missing bar", function() {
          expect(data().bars['invalid']).to.be.undefined;
        });
      });

    });

/*
 * ========
 * addBar()
 * ========
 */
    describe('#addBar()', function() {
      context('when existing rowID is given', function() {
        context('when no barID is given', function() {
          beforeEach(function() {
            DataManager.addBar('row1');
          });

          it ('adds a bar to the entities', function() {
            var barCount = _.size(data().bars);
            var originalBarCount = _.size(originalData().bars);
            expect(barCount).to.eql(originalBarCount + 1);
          });

          it('inserts a bar at the end of the given row', function() {
            newID = _.last(data().rows['row1'].bars);
            expect(data().rows['row1'].bars).to.eql(['bar1', 'bar2', newID]);
          });

          it('sets the ID param on the bar entity', function() {
            var newID = _.last(_.keys(data().bars));
            expect(data().bars[newID].id).to.eql(newID);
          });


          it('adds a new chord', function() {
            var chordCount = _.size(data().chords);
            var originalChordCount = _.size(originalData().chords);
            expect(chordCount).to.eql(originalChordCount + 1);
          });

          it('adds that chord to the new bar', function() {
            newID = _.last(data().rows['row1'].bars);
            expect(data().bars[newID].chords.length).to.eql(1);
          });
        });

        context('when barID is given', function() {
          context('when barID is valid', function() {
            it('inserts a new bar in row at the correct index', function() {
              DataManager.addBar('row1', 'bar1');
              addedBarID = _.last(_.keys(data().bars));
              var index = data().rows['row1'].bars.indexOf(addedBarID);
              expect(index).to.eql(1);
            });
          })

          context('when barID is invalid', function() {
            it('appends a new bar at the end of the row', function() {
              DataManager.addBar('row1', 'invalid');
              addedBarID = _.last(_.keys(data().bars));
              expect(data().rows['row1'].bars).to.eql(['bar1', 'bar2', addedBarID]);
            });
          });
        });
      });

      context('when invalid rowID is given', function() {
        beforeEach(function() {
          DataManager.addBar('invalid');
        });

        it("doesn't add a bar entity", function() {
          var barCount = _.size(data().bars);
          var originalBarCount = _.size(originalData().bars);
          expect(barCount).to.eql(originalBarCount);
        });

        it("doesn't create the missing row", function() {
          expect(data().rows['invalid']).to.be.undefined;
        });
      });
    });

/*
 * ========
 * addRow()
 * ========
 */
    describe('#addRow()', function() {
      context('when existing sectionID is given', function() {
        context('when no rowID is given', function() {
          beforeEach(function() {
            DataManager.addRow('section1');
          });

          it ('adds a row to the entities', function() {
            var rowCount = _.size(data().rows);
            var originalRowCount = _.size(originalData().rows);
            expect(rowCount).to.eql(originalRowCount + 1);
          });

          it('inserts a row at the end of the given section', function() {
            newID = _.last(data().sections['section1'].rows);
            expect(data().sections['section1'].rows).to.eql(['row1', 'row2', newID]);
          });

          it('sets the ID param on the row entity', function() {
            var newID = _.last(_.keys(data().rows));
            expect(data().rows[newID].id).to.eql(newID);
          });

          it('adds DEFAULT_NUM_BARS_IN_ROW bar entities ', function() {
            var barCount = _.size(data().bars);
            var originalBarCount = _.size(originalData().bars);
            expect(barCount).to.eql(originalBarCount + DEFAULT_NUM_BARS_IN_ROW);
          });

          it('adds those bars to the row', function() {
            newID = _.last(data().sections['section1'].rows);
            expect(data().rows[newID].bars.length).to.eql(DEFAULT_NUM_BARS_IN_ROW);
          });
        });

        context('when rowID is given', function() {
          context('when rowID is valid', function() {
            it('inserts a new row in section at the correct index', function() {
              DataManager.addRow('section1', 'row1');
              addedRowID = _.last(_.keys(data().rows));
              var index = data().sections['section1'].rows.indexOf(addedRowID);
              expect(index).to.eql(1);
            });
          });

          context('when rowID is invalid', function() {
            it('appends a new row at the end of the section', function() {
              DataManager.addRow('section1', 'invalid');
              addedRowID = _.last(_.keys(data().rows));
              expect(data().sections['section1'].rows).to.eql(['row1', 'row2', addedRowID]);
            });
          });
        });
      });

      context('when invalid sectionID is given', function() {
        beforeEach(function() {
          DataManager.addRow('invalid');
        });

        it("doesn't add a row entity", function() {
          var rowCount = _.size(data().rows);
          var originalRowCount = _.size(originalData().rows);
          expect(rowCount).to.eql(originalRowCount);
        });

        it("doesn't create the missing section", function() {
          expect(data().sections['invalid']).to.be.undefined;
        });
      });
    });

/*
 * ============
 * addSection()
 * ============
 */
    describe('#addSection()', function() {
      context('when no sectionID is given to append after', function() {
        beforeEach(function() {
          DataManager.addSection();
        });

        it('creates a new section entity', function() {
          var sectionCount = _.size(data().sections);
          var originalSectionCount = _.size(originalData().sections);
          expect(sectionCount).to.eql(originalSectionCount + 1)
        });

        it('adds the section at the end of the sheet', function() {
          var newSectionID = _.last(_.keys(data().sections));
          expect(data().main.sections).to.eql(['section1', 'section2', newSectionID])
        });

        it('sets the ID param on the section entity', function() {
          var newID = _.last(_.keys(data().sections));
          expect(data().sections[newID].id).to.eql(newID);
        });

        it('creates a new row entity', function() {
          var rowCount = _.size(data().rows);
          var originalRowCount = _.size(originalData().rows);
          expect(rowCount).to.eql(originalRowCount + 1);
        });

        it('adds that row to the new section', function() {
          var newSectionID = _.last(_.keys(data().sections));
          var lastRowID = _.last(_.keys(data().sections));
          expect(data().sections[newSectionID].rows.length).to.eql(1);
          expect(data().sections[newSectionID].rows.indexOf(lastRowID))
            .to.not.be.undefined;
        });

      });

      context('when sectionID is given', function() {
        context('when sectionID is valid', function() {
          it('adds the new section at the correct index', function() {
            DataManager.addSection('section1');
            var addedSectionID = _.last(_.keys(data().sections));
            var index = data().main.sections.indexOf(addedSectionID);
            expect(index).to.eql(1);
          });
        });

        context('when sectionID is invalid', function() {
          beforeEach(function() {
            DataManager.addSection('invalid');
          });

          it('adds the new section at the end of the sheet', function() {
            var addedSectionID = _.last(_.keys(data().sections));
            var index = data().main.sections.indexOf(addedSectionID);
            expect(index).to.eql(2);
          });

          it("doesn't create the missing section", function() {
            expect(data().sections['invalid']).to.be.undefined;
          })
        });
      });
    }); // End of #addSection()


/*
 * =============
 * deleteChord()
 * =============
 */
    describe ('#deleteChord()', function() {
      context('when chordID and barID are valid', function() {
        beforeEach(function() {
          DataManager.deleteChord('chord2', 'bar1');
        });

        it('deletes a chord entity', function() {
          var chordCount = _.size(_.keys(data().chords));
          var originalChordCount = _.size(_.keys(originalData().chords));
          expect(chordCount).to.eql(originalChordCount - 1);
        });

        it('removes the ref from parent', function() {
          expect(data().bars['bar1'].chords).to.eql(['chord1']);
        });

        context('when parent bar has no chords left', function() {
          it('removes that bar from the entities', function() {
            DataManager.deleteChord('chord1', 'bar1');
            expect(data().bars['bar1']).to.be.undefined;
          });

          it('removes that bar from the parent row', function() {
            DataManager.deleteChord('chord1', 'bar1');
            expect(data().rows['row1'].bars.indexOf('bar1')).to.eql(-1);
          });
        });
      });

      context('when chordID is invalid', function() {
        it("doesn't delete any entity", function() {
          DataManager.deleteChord('invalid', 'bar1');
          expect(data()).to.eql(originalData());
        });
      });

      context('when barID is invalid', function() {
        it("doesn't delete any entity", function() {
          DataManager.deleteChord('chord1', 'invalid');
          expect(data()).to.eql(originalData());
        });
      });
    }); // End of #deleteChord()

/*
 * ===========
 * deleteBar()
 * ===========
 */
    describe ('#deleteBar()', function() {
      context('when barID and rowID are valid', function() {
        beforeEach(function() {
          DataManager.deleteBar('bar1', 'row1');
        });

        it('deletes a bar entity', function() {
          var barCount = _.size(_.keys(data().bars));
          var originalBarCount = _.size(_.keys(originalData().bars));
          expect(barCount).to.eql(originalBarCount - 1);
        });

        it('removes the bar ref from parent row', function() {
          expect(data().rows['row1'].bars).to.eql(['bar2']);
        });

        context('when parent row has no bars left', function() {
          it('removes that row from the entities', function() {
            DataManager.deleteBar('bar2', 'row1');
            expect(data().rows['row1']).to.be.undefined;
          });

          it('removes that row from the parent section', function() {
            DataManager.deleteBar('bar2', 'row1');
            expect(data().sections['section1'].rows.indexOf('row1')).to.eql(-1);
          });
        });
      });

      context('when barID is invalid', function() {
        it("doesn't affect the data", function() {
          DataManager.deleteBar('invalid', 'row1');
          expect(data()).to.eql(originalData());
        });
      });

      context('when rowID is invalid', function() {
        it("doesn't affect the data", function() {
          DataManager.deleteBar('bar1', 'invalid');
          expect(data()).to.eql(originalData());
        });
      });
    }); // End of #deleteBar()

/*
 * ===========
 * deleteRow()
 * ===========
 */
    describe ('#deleteRow()', function() {
      context('when rowID and sectionID are valid', function() {
        beforeEach(function() {
          DataManager.deleteRow('row1', 'section1');
        });

        it('deletes a row entity', function() {
          var rowCount = _.size(_.keys(data().rows));
          var originalRowCount = _.size(_.keys(originalData().rows));
          expect(rowCount).to.eql(originalRowCount - 1);
        });

        it('removes the row ref from parent section', function() {
          expect(data().sections['section1'].rows).to.eql(['row2']);
        });

        context('when parent section has no rows left', function() {
          it('removes that section from the entities', function() {
            DataManager.deleteRow('row2', 'section1');
            expect(data().sections['section1']).to.be.undefined;
          });

          it('removes that section from the main sectionsList', function() {
            DataManager.deleteRow('row2', 'section1');
            expect(data().main.sections.indexOf('section1')).to.eql(-1);
          });
        });
      });

      context('when rowID is invalid', function() {
        it("doesn't affect the data", function() {
          DataManager.deleteRow('invalid', 'section1');
          expect(data()).to.eql(originalData());
        });
      });

      context('when sectionID is invalid', function() {
        it("doesn't affect the data", function() {
          DataManager.deleteRow('row1', 'invalid');
          expect(data()).to.eql(originalData());
        });
      });
    }); // End of #deleteRow()


/*
 * ===============
 * deleteSection()
 * ===============
 */
    describe ('#deleteSection()', function() {
      context('when sectionID is valid', function() {
        beforeEach(function() {
          DataManager.deleteSection('section1');
        });

        it('deletes a section entity', function() {
          var sectionCount = _.size(_.keys(data().sections));
          var originalSectionCount = _.size(_.keys(originalData().sections));
          expect(sectionCount).to.eql(originalSectionCount - 1);
        });

        it('removes the section ref from sections list', function() {
          expect(data().main.sections).to.eql(['section2']);
        });
      });

      context('when sectionID is invalid', function() {
        it("doesn't affect the data", function() {
          DataManager.deleteSection('invalid');
          expect(data()).to.eql(originalData());
        });
      });
    }); // End of #deleteSection()
  }); // End of 'data management'

  describe('#toggleSegno()', function() {
    context("when called with valid barID", function() {
      context("when no flag has been set", function() {
        it("sets the segno flag to true", function() {
          DataManager.setData(originalData());
          DataManager.toggleSegno('bar1');
          expect(DataManager.getData().bars['bar1'].segno).to.eql(true);
        });
      }); // End of context 'when no flag has been set'

      context("when a flag was set to false", function() {
        it("sets the segno flag to true", function() {
          var data = originalData();
          data.bars.bar1.segno = false;
          DataManager.setData(data);
          DataManager.toggleSegno('bar1');
          expect(DataManager.getData().bars['bar1'].segno).to.eql(true);
        });
      }); // End of context 'when a flag was set to false'

      context("when the flag was set to true", function() {
        it("sets the segno flag to false", function() {
          var data = originalData();
          data.bars.bar1.segno = true;
          DataManager.setData(data);
          DataManager.toggleSegno('bar1');
          expect(DataManager.getData().bars['bar1'].segno).to.eql(false);
        });
      }); // End of context 'when the flag was set to true'
    }); // End of context 'when called with valid barID'

    context("when called with unexisting barID", function() {
      it("throws an error", function() {
        expect(DataManager.toggleSegno.bind(null, 'invalid')).to.throw("Could not toggle segno on bar invalid.");
      });
    }); // End of context 'when called with unexisting barID'
  }); // End of describe '#toggleSegno()'

  describe('#toggleCoda()', function() {
    context("when called with valid barID", function() {
      context("when no flag has been set", function() {
        it("sets the coda flag to true", function() {
          DataManager.setData(originalData());
          DataManager.toggleCoda('bar1');
          expect(DataManager.getData().bars['bar1'].coda).to.eql(true);
        });
      }); // End of context 'when no flag has been set'

      context("when a flag was set to false", function() {
        it("sets the coda flag to true", function() {
          var data = originalData();
          data.bars.bar1.coda = false;
          DataManager.setData(data);
          DataManager.toggleCoda('bar1');
          expect(DataManager.getData().bars['bar1'].coda).to.eql(true);
        });
      }); // End of context 'when a flag was set to false'

      context("when the flag was set to true", function() {
        it("sets the coda flag to false", function() {
          var data = originalData();
          data.bars.bar1.coda = true;
          DataManager.setData(data);
          DataManager.toggleCoda('bar1');
          expect(DataManager.getData().bars['bar1'].coda).to.eql(false);
        });
      }); // End of context 'when the flag was set to true'
    }); // End of context 'when called with valid barID'

    context("when called with unexisting barID", function() {
      it("throws an error", function() {
        expect(DataManager.toggleCoda.bind(null, 'invalid')).to.throw("Could not toggle coda on bar invalid.");
      });
    }); // End of context 'when called with unexisting barID'
  }); // End of describe '#toggleSegno()'
}); // End of specs in this file

function data() {
  return DataManager.getData();
}

function originalData() {
  return {
    main: {
      title: "theTitle",
      artist: "theArtist",
      sections: [ "section1", "section2" ]
    },
    sections: {
      section1: { id: "section1", name: "intro", rows: [ "row1", "row2", ] },
      section2: { id: "section2", name: "verse", rows: [ "row3" ] }
    },
    rows: {
      row1: { id: "row1", bars: [ "bar1", "bar2" ] },
      row2: { id: "row2", bars: [ "bar3" ] },
      row3: { id: "row3", bars: [ "bar4" ] }
    },
    bars: {
      bar1: { id: "bar1", chords: [ "chord1", "chord2" ] },
      bar2: { id: "bar2", chords: [ "chord3", "chord4" ] },
      bar3: { id: "bar3", chords: [ "chord5" ] },
      bar4: { id: "bar4", chords: [ "chord6" ] }
    },
    chords: {
      chord1: { id: "chord1", raw: "chord1-raw" },
      chord2: { id: "chord2", raw: "chord2-raw" },
      chord3: { id: "chord3", raw: "chord3-raw" },
      chord4: { id: "chord4", raw: "chord4-raw" },
      chord5: { id: "chord5", raw: "chord5-raw" },
      chord6: { id: "chord6", raw: "chord6-raw" }
    }
  }
}
