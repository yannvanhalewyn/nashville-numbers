TODOLIST
========

ShortTerm
---------
TODO Make tabbing through append new bars if needed
TODO Chord spacing (should be straight forward)
TODO Deleting bar should select the previous one
  -- Maybe add a prop for focus
TODO Add undo stack. Is pretty simple -> command pattern, that book will pay off!

Before deployment
-----------------
- Set autoindexing to false for mongoose models (http://mongoosejs.com/docs/guide.html)

TIPS
====

- Add valiator for JSON sheet data. Or maybe just DONT update if invalid
  Sheet(model).schema.path('data').validate(function(value) {
    // Test for valid JSON, return true/false
  }, 'corrupt');

- Use $text to search mongo for strings, it uses text indexes!
  http://docs.mongodb.org/manual/core/index-text/
