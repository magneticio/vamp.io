interpolate - Simple JavaScript string interpolation
====================================================

A simple interpolate function for JavaScript. It is just based on simple RegExp 
and `String#replace` so mostly useful when you have simple use cases and want
something quick and dirty. Don't use it as a template tool unless it really is 
just something tiny.

usage
-----

```javascript
var interpolate = require('interpolate');
var result = interpolate('{greeting}! I am {name}.', {
  greeting: 'Hello',
  name: 'Gilles'
});

console.log(result); // 'Hello! I am Gilles.'
```

You can change the delimiter from the simple `{` `}` to something else, such as 
`{{` `}}` or `<%` `%>`.
Just pass in the new delimiter in the options.
**N.B. the start and end delimiter need to have the same
length.**

```javascript
var interpolate = require('interpolate');
var result = interpolate('<%greeting%>! I am <%name%>.', {
  greeting: 'Hello',
  name: 'Gilles'
}, { delimiter: '<%%>' });

console.log(result); // 'Hello! I am Gilles.'
```

See tests for some more advanced usage, i.e. with arrays, objects, etc.


install
-------
you can install `interpolate` with

```
   npm install interpolate
```

tests
-----
To run the tests, you need to run `npm install` in the root of the module.

Either run `make` or `npm test` to run the tests and see the spec.


Release notes:
0.1.0 - initial release
