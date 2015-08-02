var include = require('include')
  , expect  = require('chai').expect
  , Cypher  = include('/helpers/cypher')

describe('CYPHER', function() {
  describe('#match()', function() {
    context("when no params are given", function() {
      it("returns MATCH (l:Labelname)", function() {
        expect(Cypher.match('p', 'Person')).to.eql("MATCH (p:Person) ")
      });
    }); // End of context 'when one param is given'

    context("when one param is given", function() {
      it("returns MATCH (l:label {param: {param}})", function() {
        expect(Cypher.match('p', 'Person', {name: "Yann"})).to.eql(
          "MATCH (p:Person{name:{name}}) "
        );
      });
    }); // End of context 'when one param is given'

    context("when many params are given", function() {
      it("returns an valid string containing every param", function() {
        expect(Cypher.match('p', 'Person', {
          name: "theName", lastName: "theLastName", foo: "Bar"
        })).to.eql("MATCH (p:Person{name:{name},lastName:{lastName},foo:{foo}}) ");
      });
    }); // End of context 'when many params are given'
  }); // End of describe '#match()'

  describe('#where()', function() {
    it("returns WHERE id(x) = {propname}", function() {
      expect(Cypher.whereIdIs('p', 'user_id')).to.eql("WHERE id(p) = {user_id} ");
    });
  }); // End of describe 'when'

  describe('#set()', function() {
    it("returns SET s.xx = {xx} ", function() {
      expect(Cypher.set('x', {title: "newTitle", artist: "newArtist"})).to.eql(
        "SET x.title = {title}, x.artist = {artist} "
      );
    });

    it("doesn't take an undefined param into account", function() {
      expect(Cypher.set('x', {foo: "bar", bax: undefined})).to.eql(
        "SET x.foo = {foo} "
      );
    });

    it("returns an empty string when no params are given", function() {
      expect(Cypher.set('x')).to.eql("");
    });

    it("returns an empty string when params object is empty", function() {
      expect(Cypher.set('x', {})).to.eql("")
    });
  }); // End of describe '#set()'

  describe('#merge()', function() {
    it("returns MERGE (x:label {prop: {prop}})", function() {
      expect(Cypher.merge('x', 'Label', {name: "theName", age: 23})).to.eql(
        "MERGE (x:Label{name:{name},age:{age}}) "
      );
    });

    it("throws when no params are given", function() {
       expect(Cypher.merge.bind(null, 'x', 'Label')).to.throw();
    });

    it("throws when an empty params object is given", function() {
       expect(Cypher.merge.bind(null, 'x', 'Label', {})).to.throw();
    });
  }); // End of describe '#merge()'

  describe('#create()', function() {
    context("when one param is given", function() {
      it("returns CREATE (l:label {param: {param}})", function() {
        expect(Cypher.create('p', 'Person', {name: "Yann"})).to.eql(
          "CREATE (p:Person{name:{name}}) "
        );
      });
    }); // End of context 'when one param is given'

    context("when many params are given", function() {
      it("returns an valid string containing every param", function() {
        expect(Cypher.create('p', 'Person', {
          name: "theName", lastName: "theLastName", foo: "Bar"
        })).to.eql("CREATE (p:Person{name:{name},lastName:{lastName},foo:{foo}}) ");
      });
    }); // End of context 'when many params are given'
  }); // End of describe '#create()'

  describe('#return()', function() {
    context("when a string is given", function() {
      it("returns a valid RETURN string", function() {
        expect(Cypher.return('s')).to.eql("RETURN s");
      });
    }); // End of context 'when a string is given'

    context("when an array of strings is given", function() {
      it("returns a RETURN string containing all varnames", function() {
        expect(Cypher.return(['a', 'b', 'c'])).to.eql("RETURN a, b, c");
      }); 
    }); // End of context ''
  }); // End of describe '#return()'
}); // End of describe 'CYPHER'
