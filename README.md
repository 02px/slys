# slys
The efficient and <s>un</s>helpful JavaScript library.

# Installation
With NPM:
```scss
$ npm i --save slys
```

# Usage
```js
const slys = require("slys"); // Node.JS

slys.all({ a: true, b: false }, true); // wheter all elements are true.
// =>  false

slys.any({ a: true, b: false }, false); // wheter any of the elements is false.
// =>  true

// splits the iterable into chunks with a length specified (or less).
slys.chunk([ 1, 2, 3, 4, 5 ], 2);
// =>  [ [ 1, 2 ], [ 3, 4 ], [ 5 ] ]

// takes a format string and a set of positional arguments and returns a Formatter class.
const str = slys.format("{0} up {1} {final}", "keep", "to");
// =>  "keep up to {final}"

// Formatter.where: the same as `format`, but access arguments by name.
str.where({ final: "date!" });
// => "keep up to date!"

// returns a list containing mathematics progressions.
str.range(-5, 5);
// =>  [ -5, -4, -3, -2, -1, 0, 1, 2, 3, 4 ]

// creates a list of tuples where the i-th tuple contains the i-th element from each of the argument iterable.
slys.zip([ 1, 4, 7], [ 2, 5, 8 ], [ 3, 6, 9 ]);
// =>  [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ] 
```
> 