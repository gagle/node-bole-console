bole-console
============

#### Console formatter for the bole logger ####

[![npm version][npm-version-image]][npm-url]

[![npm install][npm-install-image]][npm-url]

Plugin for the [bole][bole-url] logger. Formats and colorizes the JSON object and prints it to the stdout.

```javascript
var bole = require ("bole");
var boleConsole = require ("bole-console");

bole.output ([
  { level: 'info', stream: boleConsole ({ timestamp: true }) }
]);

var log = bole ("my-module");
```

Some outputs:

- `log.warn ({ foo: "bar" }, "baz")`

  ![output1][output1]
- `log.error (new Error ("foo"), "bar")`

  ![output2][output2]
- `log.info (request, "foo")`

  ![output3][output3]

<a name="create"></a>
___module_([options]) : Writable__

Returns a new Writable stream instance.

Options:

- __timestamp__ - _Boolean_
  Includes the ISO string of the current time.
- __hostname__ - _Boolean_
  Includes the hostname of the current user.
- __pid__ - _Boolean_
  Includes the pid of the current process.
- __indent__ - _Number_
  Number of spaces for each level when objects are formatted. Default 2.

[npm-version-image]: http://img.shields.io/npm/v/bole-console.svg
[npm-install-image]: https://nodei.co/npm/bole-console.png?mini=true
[npm-url]: https://npmjs.org/package/bole-console
[bole-url]: https://github.com/rvagg/bole
[output1]: https://github.com/gagle/node-bole-console/blob/master/images/output1.png
[output2]: https://github.com/gagle/node-bole-console/blob/master/images/output2.png
[output3]: https://github.com/gagle/node-bole-console/blob/master/images/output3.png