TODOLIST
========

ShortTerm
---------
TODO Chord spacing (should be straight forward)
TODO Deleting bar should select the previous one
  -- Maybe add a prop for focus
TODO Add undo stack. Is pretty simple -> command pattern, that book will pay off!
TODO BUG: When entered a chord like ('h'), the box shadow dissapears but no
     chord appears. Thats because it thinks it's content is full, while it's a bad
     chord
TODO is 17 a bug or lack of superscript?

BEFORE DEPLOYMENT
=================
Check out react pure mixin. You get a performance boost if you follow some
rules.


TIPS
====

- Add valiator for JSON sheet data. Or maybe just DONT update if invalid
  Sheet(model).schema.path('data').validate(function(value) {
    // Test for valid JSON, return true/false
  }, 'corrupt');

- Use $text to search mongo for strings, it uses text indexes!
  http://docs.mongodb.org/manual/core/index-text/
